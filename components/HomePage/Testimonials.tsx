import React from 'react';

const testimonials = [
  {
    quote: "This app has changed the way I work! It's fantastic.",
    name: "John Doe",
    avatar: "https://via.placeholder.com/50"
  },
  {
    quote: "A must-have tool for anyone looking to improve productivity.",
    name: "Jane Smith",
    avatar: "https://via.placeholder.com/50"
  },
  {
    quote: "Incredible results, I can't recommend it enough!",
    name: "Alice Johnson",
    avatar: "https://via.placeholder.com/50"
  }
];

const Testimonials = () => {
  return (
    <section className="testimonials">
      <h2>Testimonials</h2>
      <div className="testimonial-list">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="testimonial-item">
            <img src={testimonial.avatar} alt={testimonial.name} />
            <blockquote>{testimonial.quote}</blockquote>
            <p>- {testimonial.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
