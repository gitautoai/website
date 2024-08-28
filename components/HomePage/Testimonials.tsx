import React from 'react';

const Testimonials = () => {
  return (
    <div id="testimonials" className="min-h-screen h-screen flex flex-col justify-center items-center">
      <h2 className="text-3xl md:text-4xl">Testimonials</h2>
      <div className="mt-10 space-y-8">
        <blockquote className="text-center">
          <p>"This product has changed the way I work completely! Highly recommended."</p>
          <footer>- Alex Doe</footer>
        </blockquote>
        <blockquote className="text-center">
          <p>"A must-have tool for anyone looking to improve their workflow."</p>
          <footer>- Jamie Smith</footer>
        </blockquote>
        <blockquote className="text-center">
          <p>"Incredible results and fantastic support from the team."</p>
          <footer>- Taylor Johnson</footer>
        </blockquote>
      </div>
    </div>
  );
};

export default Testimonials;