import React from "react";

const testimonials = [
  {
    name: "John Doe",
    feedback: "This product has changed the way I work. It's fantastic!",
    photo: "/path/to/photo1.jpg",
  },
  {
    name: "Jane Smith",
    feedback: "A must-have tool for anyone serious about productivity.",
    photo: "/path/to/photo2.jpg",
  },
  {
    name: "Sam Wilson",
    feedback: "Incredible results, and the support team is amazing!",
    photo: "/path/to/photo3.jpg",
  },
];

export default function TestimonialsSection() {
  return (
    <div className="min-h-screen h-screen flex flex-col items-center justify-center">
      <h2 className="text-3xl md:text-4xl mb-8">Testimonials</h2>
      <div className="space-y-8">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="text-center">
            <img src={testimonial.photo} alt={testimonial.name} className="w-24 h-24 rounded-full mx-auto mb-4" />
            <p className="text-xl">"{testimonial.feedback}"</p>
            <p className="mt-2 font-semibold">- {testimonial.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
