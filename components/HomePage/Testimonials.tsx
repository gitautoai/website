import React from 'react';

const Testimonials = () => {
  return (
    <section className="testimonials">
      <h2>Testimonials</h2>
      <div className="testimonial">
        <p>"This product has changed my life for the better! Highly recommend to everyone." - Alex D.</p>
      </div>
      <div className="testimonial">
        <p>"A must-have tool for anyone looking to improve their workflow." - Jamie L.</p>
      </div>
      <div className="testimonial">
        <p>"Exceptional service and support. Five stars!" - Casey M.</p>
      </div>
    </section>
  );
};

export default Testimonials;

// Note: Add appropriate styling in the global CSS file to match the design of the homepage.
// Ensure that the testimonials section is responsive and visually appealing.
// This component should be integrated into the main page between the UseCases and HowToGetStarted components.
