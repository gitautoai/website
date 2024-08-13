import React from 'react';

const testimonials = [
  {
    quote: "This app has completely changed the way I work. It's fantastic!",
    name: "John Doe",
    avatar: "👤",
  },
  {
    quote: "A must-have tool for anyone looking to improve their productivity.",
    name: "Jane Smith",
    avatar: "👤",
  },
  {
    quote: "Incredible features and easy to use. Highly recommended!",
    name: "Alice Johnson",
    avatar: "👤",
  },
];

const Testimonials = () => {
  return (
    <section className="testimonials">
      <h2>Testimonials</h2>
      <div className="testimonial-list">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="testimonial">
            <p>{testimonial.avatar}</p>
            <blockquote>{testimonial.quote}</blockquote>
            <p>- {testimonial.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
