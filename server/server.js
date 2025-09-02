require('dotenv').config();

// --- PRE-STARTUP CHECKS ---
if (!process.env.DATABASE_URL) {
  console.error("FATAL ERROR: DATABASE_URL is not defined. The application cannot start without a database connection string.");
  process.exit(1);
}
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.error("FATAL ERROR: Razorpay API keys are not defined. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your environment variables.");
  process.exit(1);
}
if (!process.env.RAZORPAY_WEBHOOK_SECRET) {
    console.warn("WARNING: RAZORPAY_WEBHOOK_SECRET is not defined. Webhook verification will be skipped.");
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

const UPLOADS_DIR = process.env.NODE_ENV === 'production' 
  ? '/opt/render/project/src/server/uploads' 
  : path.join(__dirname, 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const notificationClient = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    },
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

// This webhook route must come BEFORE bodyParser.json()
app.post('/api/payments/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (secret) {
        const shasum = crypto.createHmac('sha256', secret);
        shasum.update(req.body);
        const digest = shasum.digest('hex');

        if (digest !== req.headers['x-razorpay-signature']) {
            console.error('Webhook signature validation failed.');
            return res.status(400).json({ status: 'Signature validation failed' });
        }
    }

    const event = JSON.parse(req.body.toString());

    if (event.event === 'payment.captured') {
        const payment = event.payload.payment.entity;
        const { order_id, amount, email, contact } = payment;
        const { campaignId, donorName, donorPan } = payment.notes;

        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const donationQuery = `
                INSERT INTO donations (campaign_id, donor_name, donor_pan, amount, razorpay_order_id, razorpay_payment_id, status)
                VALUES ($1, $2, $3, $4, $5, $6, 'success')
                ON CONFLICT (razorpay_order_id) DO UPDATE SET
                razorpay_payment_id = EXCLUDED.razorpay_payment_id,
                status = 'success';
            `;
            await client.query(donationQuery, [campaignId, donorName, donorPan, amount / 100, order_id, payment.id]);
            
            const campaignUpdateQuery = `
                UPDATE campaigns 
                SET raised_amount = raised_amount + $1, supporters = supporters + 1 
                WHERE id = $2;
            `;
            await client.query(campaignUpdateQuery, [amount / 100, campaignId]);

            await client.query('COMMIT');
            console.log(`Successfully processed webhook for order ${order_id}`);
        } catch (err) {
            await client.query('ROLLBACK');
            console.error('Error processing webhook:', err.stack);
        } finally {
            client.release();
        }
    }

    res.json({ status: 'ok' });
});


app.use(express.static('public'));
app.use('/uploads', express.static(UPLOADS_DIR));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


async function initializeDatabase() {
  let client;
  try {
    client = await pool.connect();
    console.log("Database connection successful for initialization.");
    await client.query(`
      CREATE TABLE IF NOT EXISTS campaigns (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        target_amount DECIMAL(10,2) NOT NULL,
        raised_amount DECIMAL(10,2) DEFAULT 0,
        creator_name VARCHAR(255) NOT NULL,
        creator_email VARCHAR(255),
        creator_phone VARCHAR(15),
        creator_pan VARCHAR(10),
        ngo_name VARCHAR(255),
        ngo_address TEXT,
        ngo_website VARCHAR(255),
        image VARCHAR(255) NOT NULL,
        end_date TIMESTAMP NOT NULL,
        supporters INTEGER DEFAULT 0,
        location VARCHAR(255),
        category VARCHAR(100),
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS donations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
        donor_name VARCHAR(255) NOT NULL,
        donor_pan VARCHAR(10),
        amount DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        razorpay_order_id VARCHAR(255) UNIQUE,
        razorpay_payment_id VARCHAR(255) UNIQUE,
        status VARCHAR(50) DEFAULT 'pending'
      )
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        full_name TEXT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        user_type TEXT NOT NULL DEFAULT 'user',
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
    await client.query(`
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
    await client.query(`
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
    console.error('Database initialization error:', err.stack);
  } finally {
    if (client) client.release();
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
        console.error('PostgreSQL listener error:', err.stack);
    }
}
startRealTimeListener();

// --- AUTHENTICATION ROUTES ---

app.post('/signup', async (req, res) => {
  let client;
  try {
    client = await pool.connect();
    const {
      full_name, mobile_number, email, password, dob, address, city,
      pincode, country, occupation, user_type, account_type, ngo_id,
    } = req.body;
    const userCheck = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(409).json({ success: false, message: 'Email already registered.' });
    }
    const id = uuidv4();
    const password_hash = await bcrypt.hash(password, 10);
    const dobForDb = dob || null;
    await client.query(
      `INSERT INTO users (id, full_name, email, password_hash, user_type, account_type, mobile_number, ngo_id, dob, address, city, pincode, country, occupation)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
      [
        id, full_name, email, password_hash, user_type, account_type || null,
        mobile_number || null, ngo_id || null, dobForDb, address || null,
        city || null, pincode || null, country || null, occupation || null,
      ]
    );
    res.status(201).json({ success: true, message: 'Signup successful!' });
  } catch (err) {
    console.error('SIGNUP ROUTE FAILED:', err.stack);
    res.status(500).json({ success: false, message: 'Server error during signup.' });
  } finally {
    if (client) client.release();
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Invalid email!' });
    }
    const user = result.rows[0];
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (isValid) {
      res.json({
        success: true,
        message: 'Login successful',
        user: { email: user.email, user_type: user.user_type }
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (err) {
    console.error('Login error:', err.stack);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
});

// --- CROWDFUNDING CAMPAIGN ROUTES ---

app.post('/api/image-upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No image file provided.' });
  }
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ success: true, imageUrl: imageUrl });
});

app.get('/api/campaigns', async (req, res) => {
  const { category } = req.query;
  let query = `
    SELECT 
      id, title, description, target_amount, raised_amount, 
      creator_name, image, category,
      GREATEST(0, FLOOR(DATE_PART('day', end_date - NOW()))) as days_left,
      supporters, location, created_at,
      ROUND((raised_amount / target_amount * 100)::numeric, 2) as progress_percentage
    FROM campaigns 
    WHERE status = 'approved' AND end_date >= NOW() 
  `;
  const queryParams = [];

  if (category) {
    query += ' AND category = $1';
    queryParams.push(category);
  }

  query += ' ORDER BY created_at DESC';

  try {
    const result = await pool.query(query, queryParams);
    res.json({ success: true, campaigns: result.rows });
  } catch (err) {
    console.error('Get campaigns error:', err.stack);
    res.status(500).json({ success: false, message: 'Server error fetching campaigns.' });
  }
});

app.get('/api/categories', async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT
          category,
          COUNT(*) as campaign_count,
          SUM(target_amount) as total_goal,
          SUM(raised_amount) as total_raised
        FROM campaigns
        WHERE status = 'approved' AND category IS NOT NULL AND end_date >= NOW()
        GROUP BY category
        ORDER BY category
      `);
      res.json({ success: true, categories: result.rows });
    } catch (err) {
      console.error('Get categories error:', err.stack);
      res.status(500).json({ success: false, message: 'Server error fetching categories.' });
    }
  });

app.get('/api/campaigns/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT 
        id, title, description, target_amount, raised_amount, 
        creator_name, image, category,
        GREATEST(0, FLOOR(DATE_PART('day', end_date - NOW()))) as days_left,
        supporters, location, created_at,
        ROUND((raised_amount / target_amount * 100)::numeric, 2) as progress_percentage
      FROM campaigns 
      WHERE id = $1
    `, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }
    res.json({ success: true, campaign: result.rows[0] });
  } catch (err) {
    console.error('Get campaign error:', err.stack);
    res.status(500).json({ success: false, message: 'Server error fetching campaign.' });
  }
});

app.post('/api/campaigns', upload.single('image'), async (req, res) => {
  try {
    const {
      creator_name, creator_email, creator_phone, creator_pan,
      title, description, target_amount, category,
      days_left, location, is_ngo, ngo_name, ngo_address, ngo_website
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Image is required' });
    }
    const image = req.file.filename;

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + parseInt(days_left, 10));

    const result = await pool.query(`
      INSERT INTO campaigns (
        creator_name, creator_email, creator_phone, creator_pan,
        title, description, target_amount, category,
        end_date, location, image,
        ngo_name, ngo_address, ngo_website
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING id
    `, [
      creator_name, creator_email, creator_phone, creator_pan || null,
      title, description, target_amount, category,
      endDate, location, image,
      is_ngo === 'true' ? ngo_name : null,
      is_ngo === 'true' ? ngo_address : null,
      is_ngo === 'true' ? ngo_website : null
    ]);
    
    res.status(201).json({
      success: true,
      message: 'Campaign submitted for approval! You will be notified once it is reviewed.',
      campaign_id: result.rows[0].id
    });
  } catch (err) {
    console.error('Create campaign error:', err.stack);
    res.status(500).json({ success: false, message: 'Server error creating campaign.' });
  }
});

// --- ADMIN ROUTES ---

app.get('/api/admin/campaigns/pending', async (req, res) => {
  try {
    const result = await pool.query(`
        SELECT *, GREATEST(0, FLOOR(DATE_PART('day', end_date - NOW()))) as days_left 
        FROM campaigns 
        WHERE status = 'pending' 
        ORDER BY created_at ASC
    `);
    res.json({ success: true, campaigns: result.rows });
  } catch (err) {
    console.error('Error fetching pending campaigns:', err.stack);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

app.put('/api/admin/campaigns/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status.' });
  }
  try {
    const result = await pool.query(
      "UPDATE campaigns SET status = $1 WHERE id = $2 RETURNING *",
      [status, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Campaign not found.' });
    }
    res.json({ success: true, message: `Campaign has been ${status}.`, campaign: result.rows[0] });
  } catch (err) {
    console.error(`Error updating campaign status to ${status}:`, err.stack);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// --- PAYMENT ROUTES ---

// NOTE: These routes are for the custom API integration.
// They can co-exist with the webhook but might be redundant if you only use the Payment Button.
app.post('/api/payments/create-order', async (req, res) => {
    try {
        const { amount, campaignId, donorName, donorPan } = req.body;
        if (!amount || !campaignId || !donorName || !donorPan) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }
        const receiptId = `receipt_${uuidv4().substring(0, 20)}`;
        const options = {
            amount: amount * 100,
            currency: 'INR',
            receipt: receiptId,
            notes: { campaignId, donorName, donorPan }
        };
        const order = await razorpay.orders.create(options);
        
        await pool.query(
            'INSERT INTO donations (campaign_id, donor_name, donor_pan, amount, razorpay_order_id, status) VALUES ($1, $2, $3, $4, $5, $6)',
            [campaignId, donorName, donorPan, amount, order.id, 'pending']
        );
        res.json({
            success: true,
            orderId: order.id,
            keyId: process.env.RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency
        });
    } catch (err) {
        console.error('Create order error:', err.stack);
        res.status(500).json({ success: false, message: 'Server error creating order.' });
    }
});

app.post('/api/payments/verify-payment', async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
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
            console.error('Payment verification database error:', err.stack);
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
    console.error('Get donations error:', err.stack);
    res.status(500).json({ success: false, message: 'Server error fetching donations.' });
  }
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
