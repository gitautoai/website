"use client";

import { useEffect, useState } from "react";

// Define the section structure
export type Section = {
  id: string;
  label: string;
};

// Default sections for home page
export const homeSections: Section[] = [
  { id: "hero", label: "Home" },
  { id: "stats", label: "Results" },
  { id: "why-gitauto", label: "Why" },
  { id: "what-gitauto-does", label: "What" },
  { id: "how-it-works", label: "How" },
  { id: "use-cases", label: "Use Cases" },
  { id: "how-to-get-started", label: "Get Started" },
  { id: "pricing", label: "Pricing" },
  { id: "faqs", label: "FAQ" },
];

export default function ScrollNav({ sections = homeSections }: { sections?: Section[] }) {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    // Implement scroll detection using Intersection Observer
    const observerOptions = {
      root: null, // viewport
      rootMargin: "-100px 0px -300px 0px", // top, right, bottom, left margins
      threshold: 0.2, // trigger when 20% of the target is visible
    };

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all sections
    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    // Cleanup on unmount
    return () => {
      sections.forEach((section) => {
        const element = document.getElementById(section.id);
        if (element) observer.unobserve(element);
      });
    };
  }, [sections]);

  return (
    <div className="fixed right-5 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
      <div className="flex flex-col gap-3">
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="group relative flex items-center justify-center"
            aria-label={section.label}
          >
            <span
              className={`rounded-full transition-all duration-300 ${
                activeSection === section.id
                  ? "bg-pink-600 h-3 w-3"
                  : "bg-gray-400 group-hover:bg-gray-600 h-2 w-2"
              }`}
            />
            <span className="absolute right-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-sm text-gray-700 bg-white px-2 py-1 rounded shadow-sm">
              {section.label}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
