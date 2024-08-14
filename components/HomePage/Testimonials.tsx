import React from 'react';

const testimonials = [
  {
    quote: "This product has changed the way I work! It's fantastic.",
    name: "John Doe",
    image: "/path/to/image1.png",
  },
  {
    quote: "I can't imagine my life without this app now. Highly recommended!",
    name: "Jane Smith",
    image: "/path/to/image2.png",
  },
  {
    quote: "A must-have tool for anyone looking to improve their workflow.",
    name: "Alex Johnson",
    image: "/path/to/image3.png",
  },
];

const Testimonials = () => {
  return (
    <section>
      <h2>Testimonials</h2>
      {testimonials.map((testimonial, index) => (
        <div key={index}>
          <p>{testimonial.quote}</p>
          <p>- {testimonial.name}</p>
        </div>
      ))}
    </section>
  );
};

export default Testimonials;
