import React from 'react';

const TestimonialsSection = () => {
  return (
    <div className="testimonials-section py-10">
      <h2 className="text-3xl md:text-4xl text-center mb-8">Testimonials</h2>
      <div className="flex flex-col md:flex-row justify-around items-center">
        <div className="testimonial-card p-4 m-2 border rounded shadow-md">
          <p>"This product has changed the way I work! Highly recommended."</p>
          <p className="mt-2 font-bold">- John Doe</p>
        </div>
        <div className="testimonial-card p-4 m-2 border rounded shadow-md">
          <p>"A must-have tool for anyone looking to improve their workflow."</p>
          <p className="mt-2 font-bold">- Jane Smith</p>
        </div>
        <div className="testimonial-card p-4 m-2 border rounded shadow-md">
          <p>"Incredible results and fantastic support from the team."</p>
          <p className="mt-2 font-bold">- Alex Johnson</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;
