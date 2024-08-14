import React from 'react';

const testimonials = [
  {
    quote: "This product has changed my life for the better!",
    name: "John Doe",
    avatar: "👤",
  },
  {
    quote: "An essential tool for my daily tasks.",
    name: "Jane Smith",
    avatar: "👩",
  },
  {
    quote: "I can't imagine working without it now.",
    name: "Alex Johnson",
    avatar: "👨",
  },
];

const Testimonials = () => {
  return (
    <section>
      <h2>Testimonials</h2>
      {testimonials.map((testimonial, index) => (
        <div key={index}>
          <p>{testimonial.avatar} {testimonial.quote}</p>
          <p>- {testimonial.name}</p>
        </div>
      ))}
    </section>
  );
};

export default Testimonials;
