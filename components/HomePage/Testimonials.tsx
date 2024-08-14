import React from 'react';

const testimonials = [
  {
    quote: "This product has changed my life for the better!",
    name: "John Doe",
    image: "https://via.placeholder.com/150"
  },
  {
    quote: "I can't imagine my daily routine without it.",
    name: "Jane Smith",
    image: "https://via.placeholder.com/150"
  },
  {
    quote: "A must-have tool for anyone serious about productivity.",
    name: "Alex Johnson",
    image: "https://via.placeholder.com/150"
  }
];

const Testimonials = () => {
  return (
    <section>
      <h2>Testimonials</h2>
      <div>
        {testimonials.map((testimonial, index) => (
          <div key={index}>
            <img src={testimonial.image} alt={testimonial.name} />
            <blockquote>{testimonial.quote}</blockquote>
            <p>- {testimonial.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;