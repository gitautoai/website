import React from 'react';

const Testimonials = () => {
  return (
    <section className="testimonials">
      <h2>Testimonials</h2>
      <div className="testimonial">
        <p>"This product has changed my life for the better! Highly recommend it to everyone."</p>
        <p>- John Doe</p>
        <img src="/path/to/placeholder1.jpg" alt="John Doe" />
      </div>
      <div className="testimonial">
        <p>"A must-have tool for anyone looking to improve their workflow. Exceptional quality!"</p>
        <p>- Jane Smith</p>
        <img src="/path/to/placeholder2.jpg" alt="Jane Smith" />
      </div>
      <div className="testimonial">
        <p>"Incredible results after using this product. My efficiency has doubled!"</p>
        <p>- Alex Johnson</p>
        <img src="/path/to/placeholder3.jpg" alt="Alex Johnson" />
      </div>
    </section>
  );
};

export default Testimonials;
