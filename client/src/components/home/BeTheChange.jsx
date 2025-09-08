import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaUsers, FaGlobeAsia } from 'react-icons/fa';

const BeTheChange = () => {
  return (
    <section className="bg-brand-background py-16">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-brand-primary mb-4">Be The Change You Wish To See</h2>
        <p className="text-brand-text-light max-w-3xl mx-auto mb-12">
          Every small contribution can lead to a significant impact. Join our community of donors and campaigners who are working together to solve real-world problems.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
                <FaHeart className="text-5xl text-brand-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-brand-text mb-2">Donate with Confidence</h3>
                <p className="text-brand-text-light">
                    Support verified causes and get regular updates on the impact of your contribution.
                </p>
            </div>
             <div className="bg-white p-8 rounded-lg shadow-md">
                <FaUsers className="text-5xl text-brand-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-brand-text mb-2">Start a Fundraiser</h3>
                <p className="text-brand-text-light">
                    Need funds for a medical emergency or a social cause? Start your campaign in minutes.
                </p>
            </div>
             <div className="bg-white p-8 rounded-lg shadow-md">
                <FaGlobeAsia className="text-5xl text-brand-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-brand-text mb-2">Create Social Impact</h3>
                <p className="text-brand-text-light">
                    Join thousands of others in building a better, kinder, and more supportive India.
                </p>
            </div>
        </div>
        <div className="mt-12">
            <Link to="/start-campaign" className="bg-brand-primary hover:bg-brand-primary-hover text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300">
                Start a Fundraiser
            </Link>
        </div>
      </div>
    </section>
  );
};

export default BeTheChange;
