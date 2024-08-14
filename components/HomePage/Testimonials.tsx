import React from 'react';

const testimonials = [
  {
    quote: "This product has changed the way I work! It's fantastic.",
    name: "John Doe",
    designation: "CEO, ExampleCorp"
  },
  {
    quote: "A must-have tool for anyone looking to improve their workflow.",
    name: "Jane Smith",
    designation: "Product Manager, TechSolutions"
  },
  {
    quote: "Incredible results and fantastic support team!",
    name: "Emily Johnson",
    designation: "Freelancer"
  }
];

const Testimonials = () => {
  return (
    <section>
      <h2>Testimonials</h2>
      {testimonials.map((testimonial, index) => (
        <blockquote key={index}>
          <p>"{testimonial.quote}"</p>
          <footer>- {testimonial.name}, {testimonial.designation}</footer>
        </blockquote>
      ))}
    </section>
  );
};

export default Testimonials;
