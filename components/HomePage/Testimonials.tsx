import React from 'react';

const Testimonials = () => {
  const testimonials = [
    {
      quote: "This product has changed my life for the better!",
      name: "John Doe",
      image: "/path/to/image1.jpg"
    },
    {
      quote: "I can't imagine my daily routine without it.",
      name: "Jane Smith",
      image: "/path/to/image2.jpg"
    },
    {
      quote: "Absolutely fantastic! Highly recommend to everyone.",
      name: "Alex Johnson",
      image: "/path/to/image3.jpg"
    }
  ];

  return (
    <div className="testimonials">
      {testimonials.map((testimonial, index) => (
        <div key={index} className="testimonial">
          <img src={testimonial.image} alt={testimonial.name} />
          <blockquote>{testimonial.quote}</blockquote>
          <p>- {testimonial.name}</p>
        </div>
      ))}
    </div>
  );
};

export default Testimonials;
