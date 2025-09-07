import React from 'react';
import { FaShieldAlt, FaHandHoldingHeart, FaUsers } from 'react-icons/fa';

const WhyTrustUs = () => {
  return (
    <section className="py-16 bg-brand-background">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-brand-primary mb-4">
          Why Trust Seed-the-Change?
        </h2>
        <p className="text-brand-text-light max-w-2xl mx-auto mb-12">
          We are committed to transparency, security, and ensuring that every donation reaches the right hands.
        </p>
        <div className="grid md:grid-cols-3 gap-12">
          <div className="flex flex-col items-center">
            <div className="bg-brand-secondary p-4 rounded-full text-brand-primary text-3xl mb-4">
              <FaShieldAlt />
            </div>
            <h3 className="text-xl font-semibold text-brand-text mb-2">Secure Donations</h3>
            <p className="text-brand-text-light">
              Your payments are processed securely with industry-standard encryption.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-brand-secondary p-4 rounded-full text-brand-primary text-3xl mb-4">
              <FaHandHoldingHeart />
            </div>
            <h3 className="text-xl font-semibold text-brand-text mb-2">Verified Campaigns</h3>
            <p className="text-brand-text-light">
              Every campaign is reviewed by our team to ensure its authenticity and legitimacy.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-brand-secondary p-4 rounded-full text-brand-primary text-3xl mb-4">
              <FaUsers />
            </div>
            <h3 className="text-xl font-semibold text-brand-text mb-2">Community Focused</h3>
            <p className="text-brand-text-light">
              We empower individuals and organizations to create a lasting impact in their communities.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyTrustUs;
