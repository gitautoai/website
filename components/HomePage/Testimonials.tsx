import React from 'react';
import './Testimonials.css';

const Testimonials = () => {
  return (
    <section className="testimonials">
      <h2>Testimonials</h2>
      <div className="testimonial">
        <p>"This product has changed my life!"</p>
        <h4>- John Doe</h4>
        <img src="/path/to/placeholder.jpg" alt="John Doe" />
      </div>
      <div className="testimonial">
        <p>"Incredible experience, highly recommend it!"</p>
        <h4>- Jane Smith</h4>
        <img src="/path/to/placeholder.jpg" alt="Jane Smith" />
      </div>
      <div className="testimonial">
        <p>"A must-have tool for everyone."</p>
        <h4>- Alex Johnson</h4>
        <img src="/path/to/placeholder.jpg" alt="Alex Johnson" />
      </div>
    </section>
  );
};

export default Testimonials;
