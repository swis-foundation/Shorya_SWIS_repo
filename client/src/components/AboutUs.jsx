import React from 'react';
import Navbar from './Navabr'; // Assuming Navbar is in the same folder
import Footer from './Footer';   // Assuming Footer is in the same folder

const AboutUs = () => {
  return (
    <>
      <div className="bg-brand-background pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold text-brand-primary sm:text-5xl">
            About Seed The Change
          </h1>
          <p className="mt-4 text-xl text-brand-text-light">
            Connecting passion with purpose to build a better world, one campaign at a time.
          </p>
        </div>

        <div className="mt-16 max-w-5xl mx-auto bg-white p-8 rounded-xl shadow-lg text-left">
          <h2 className="text-2xl font-bold text-brand-text mb-4">Our Mission</h2>
          <p className="text-brand-text-light mb-6">
            Our mission is to empower individuals and organizations to make a tangible impact on the world. We believe in the power of collective action to address pressing social, environmental, and humanitarian challenges. By providing a transparent, secure, and user-friendly platform, we connect passionate donors with verified causes, ensuring that every contribution creates meaningful and lasting change.
          </p>

          <h2 className="text-2xl font-bold text-brand-text mb-4">Our Vision</h2>
          <p className="text-brand-text-light">
            We envision a world where everyone has the opportunity to contribute to a cause they believe in, where communities are uplifted through mutual support, and where positive change is accessible to all. We strive to be the leading platform for social good, fostering a global community dedicated to compassion, collaboration, and collective progress.
          </p>
        </div>
      </div>
    </>
  );
};

export default AboutUs;
