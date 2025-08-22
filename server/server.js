require('dotenv').config();

// --- PRE-STARTUP CHECKS ---
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.error("FATAL ERROR: Razorpay API keys are not defined. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your environment variables.");
  process.exit(1);
}

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const http = require('http');
const { Server } = require('socket.io');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;

if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const notificationClient = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 1
});

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

async function initializeDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS campaigns (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        target_amount DECIMAL(10,2) NOT NULL,
        raised_amount DECIMAL(10,2) DEFAULT 0,
        creator_name VARCHAR(255) NOT NULL,
        image VARCHAR(255) NOT NULL,
        days_left INTEGER NOT NULL,
        supporters INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS donations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
        donor_name VARCHAR(255) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        razorpay_order_id VARCHAR(255) UNIQUE,
        razorpay_payment_id VARCHAR(255) UNIQUE,
        status VARCHAR(50) DEFAULT 'pending'
      )
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        full_name TEXT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        user_type TEXT NOT NULL,
        account_type TEXT,
        mobile_number VARCHAR(15),
        ngo_id VARCHAR(100),
        dob DATE,
        address TEXT,
        city TEXT,
        pincode VARCHAR(10),
        country TEXT,
        occupation TEXT,
        CONSTRAINT chk_mobile_length CHECK (
          mobile_number IS NULL OR 
          (char_length(mobile_number) = 10 AND mobile_number ~ '^[0-9]+$')
        )
      )
    `);
    await pool.query(`
        CREATE OR REPLACE FUNCTION notify_campaign_update()
        RETURNS TRIGGER AS $$
        DECLARE
            campaign_data JSON;
        BEGIN
            SELECT json_build_object(
                'id', NEW.id,
                'raised_amount', NEW.raised_amount,
                'target_amount', NEW.target_amount,
                'supporters', NEW.supporters
            ) INTO campaign_data;
            PERFORM pg_notify('campaign_updates', campaign_data::text);
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
    `);
    await pool.query(`
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'campaign_update_trigger') THEN
                CREATE TRIGGER campaign_update_trigger
                AFTER UPDATE OF raised_amount ON campaigns
                FOR EACH ROW
                EXECUTE FUNCTION notify_campaign_update();
            END IF;
        END;
        $$;
    `);
    console.log('Database tables and triggers initialized successfully');
  } catch (err) {
    console.error('Database initialization error:', err);
  }
}

initializeDatabase();

async function startRealTimeListener() {
    try {
        const client = await notificationClient.connect();
        await client.query('LISTEN campaign_updates');
        client.on('notification', (msg) => {
            console.log('PG notification received:', msg.channel);
            const payload = JSON.parse(msg.payload);
            io.emit('campaign_update', payload);
        });
        console.log('PostgreSQL listener for campaign_updates started.');
    } catch (err) {
        console.error('PostgreSQL listener error:', err);
    }
}
startRealTimeListener();

// --- AUTHENTICATION ROUTES ---

// Signup Route
app.post('/signup', async (req, res) => {
  const {
    full_name,
    mobile_number,
    email,
    password,
    dob, // This can be an empty string ""
    address,
    city,
    pincode,
    country,
    occupation,
    user_type,
    account_type,
    ngo_id,
  } = req.body;

  try {
    const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.json({ success: false, message: 'Email already registered.' });
    }

    const id = uuidv4();
    const password_hash = await bcrypt.hash(password, 10);
    
    // **FIX:** Convert empty string for 'dob' to null before inserting.
    // This prevents database errors for the DATE type column.
    const dobForDb = dob || null;

    await pool.query(
      `INSERT INTO users 
        (id, full_name, email, password_hash, user_type, account_type, mobile_number, ngo_id, dob, address, city, pincode, country, occupation)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
      [
        id,
        full_name,
        email,
        password_hash,
        user_type,
        account_type || null,
        mobile_number || null,
        ngo_id || null,
        dobForDb, // Use the corrected dob value
        address || null,
        city || null,
        pincode || null,
        country || null,
        occupation || null,
      ]
    );

    res.json({ success: true, message: 'Signup successful!' });

  } catch (err) {
    console.error('Signup error:', err.stack);
    res.status(500).json({ success: false, message: 'Server error during signup.' });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.json({ success: false, message: 'Invalid email!' });
    }
    const user = result.rows[0];
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (isValid) {
      res.json({ success: true, message: 'Login successful' });
    } else {
      res.json({ success: false, message: 'Invalid email or password' });
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
});

// --- CROWDFUNDING CAMPAIGN ROUTES ---

app.get('/api/campaigns', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id,
        title,
        description,
        target_amount,
        raised_amount,
        creator_name,
        image,
        days_left,
        supporters,
        created_at,
        ROUND((raised_amount / target_amount * 100)::numeric, 2) as progress_percentage
      FROM campaigns 
      ORDER BY created_at DESC
    `);
    res.json({
      success: true,
      campaigns: result.rows
    });
  } catch (err) {
    console.error('Get campaigns error:', err);
    res.status(500).json({ success: false, message: 'Server error fetching campaigns.' });
  }
});

app.get('/api/campaigns/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT 
        id,
        title,
        description,
        target_amount,
        raised_amount,
        creator_name,
        image,
        days_left,
        supporters,
        created_at,
        ROUND((raised_amount / target_amount * 100)::numeric, 2) as progress_percentage
      FROM campaigns 
      WHERE id = $1
    `, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }
    res.json({
      success: true,
      campaign: result.rows[0]
    });
  } catch (err) {
    console.error('Get campaign error:', err);
    res.status(500).json({ success: false, message: 'Server error fetching campaign.' });
  }
});

app.post('/api/campaigns', upload.single('image'), async (req, res) => {
  try {
    const {
      title,
      description,
      target_amount,
      creator_name,
      days_left
    } = req.body;
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Image is required' });
    }
    const image = req.file.filename;
    const result = await pool.query(`
      INSERT INTO campaigns (title, description, target_amount, creator_name, image, days_left)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `, [title, description, target_amount, creator_name, image, days_left]);
    res.json({
      success: true,
      message: 'Campaign created successfully',
      campaign_id: result.rows[0].id
    });
  } catch (err) {
    console.error('Create campaign error:', err);
    res.status(500).json({ success: false, message: 'Server error creating campaign.' });
  }
});

app.post('/api/payments/create-order', async (req, res) => {
    try {
        const { amount, campaignId, donorName } = req.body;
        if (!amount || !campaignId || !donorName) {
            return res.status(400).json({ success: false, message: 'Amount, campaignId, and donorName are required' });
        }
        
        const receiptId = `receipt_${uuidv4().substring(0, 20)}`;

        const options = {
            amount: amount * 100,
            currency: 'INR',
            receipt: receiptId,
            notes: {
                campaignId: campaignId,
                donorName: donorName
            }
        };

        const order = await razorpay.orders.create(options);

        await pool.query(
            'INSERT INTO donations (campaign_id, donor_name, amount, razorpay_order_id, status) VALUES ($1, $2, $3, $4, $5)',
            [campaignId, donorName, amount, order.id, 'pending']
        );

        res.json({
            success: true,
            orderId: order.id,
            keyId: process.env.RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency
        });
    } catch (err) {
        console.error('Create order error:', err);
        res.status(500).json({ success: false, message: 'Server error creating order.' });
    }
});

app.post('/api/payments/verify-payment', async (req, res) => {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        amount
    } = req.body;
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
                                    .update(body.toString())
                                    .digest('hex');
    if (expectedSignature === razorpay_signature) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            await client.query(
                `UPDATE donations SET razorpay_payment_id = $1, status = 'success' WHERE razorpay_order_id = $2`,
                [razorpay_payment_id, razorpay_order_id]
            );
            const donationResult = await client.query('SELECT campaign_id, amount FROM donations WHERE razorpay_order_id = $1', [razorpay_order_id]);
            const { campaign_id, amount: donationAmount } = donationResult.rows[0];
            await client.query(
                `UPDATE campaigns SET raised_amount = raised_amount + $1, supporters = supporters + 1 WHERE id = $2`,
                [donationAmount, campaign_id]
            );
            await client.query('COMMIT');
            res.json({ success: true, message: 'Payment verified and campaign updated.' });
        } catch (err) {
            await client.query('ROLLBACK');
            console.error('Payment verification database error:', err);
            res.status(500).json({ success: false, message: 'Server error during payment verification.' });
        } finally {
            client.release();
        }
    } else {
        res.status(400).json({ success: false, message: 'Invalid signature.' });
    }
});

app.get('/api/campaigns/:id/donations', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT donor_name, amount, created_at
      FROM donations 
      WHERE campaign_id = $1 AND status = 'success'
      ORDER BY created_at DESC
    `, [id]);
    res.json({
      success: true,
      donations: result.rows
    });
  } catch (err) {
    console.error('Get donations error:', err);
    res.status(500).json({ success: false, message: 'Server error fetching donations.' });
  }
});

// ... (dummy data routes are unchanged) ...

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
