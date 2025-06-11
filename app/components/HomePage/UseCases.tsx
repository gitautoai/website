import React, { useState, useEffect, useRef } from "react";

const cases = [
  {
    title: "Legacy SaaS with No Test Culture",
    persona: "CTO, 10-year-old SaaS",
    story: [
      "A SaaS company with a large, legacy codebase and no established test culture. Releases are slow and risky, and bugs are common. Developers are unsure where to start with testing, and manual QA is the norm.",
      "They use GitAuto to identify files with low or no test coverage and to automate the creation of unit tests, starting with smaller, less risky files.",
    ],
  },
  {
    title: "Maintaining 92% Coverage with Limited QA Resources",
    persona: "Tech Lead, Large Fintech Startup",
    story: [
      "A fintech startup with a 92% test coverage target, but only one QA engineer for a 15-engineer team. Over time, coverage drops as new features are added, and the team periodically has to dedicate time to catch up on tests.",
      "With GitAuto, the team can automatically generate and update tests on every commit and merge, maintaining coverage as the codebase evolves.",
    ],
  },
  {
    title: "Meeting Deadline for Flutter Mobile App",
    persona: "Project Manager, IT Service Company",
    story: [
      "A consulting team needed to increase test coverage from 0% to 90% within a month for their Flutter app. The client contract specified quality reports including test cases and results as part of delivery.",
      "They used GitAuto to generate test cases while having code authors review any failures, helping them meet the tight deadline with required quality metrics.",
    ],
  },
];

const UseCases = () => {
  // Use fixed initial index to avoid hydration mismatch
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Touch handling
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Set random index only after hydration is complete
  useEffect(() => {
    setIsClient(true);
    const randomIndex = Math.floor(Math.random() * cases.length);
    setActiveIndex(randomIndex);
  }, []);

  const handleNext = () => {
    setActiveIndex((prev) => (prev === cases.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? cases.length - 1 : prev - 1));
  };

  // Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true); // Pause autoplay on touch
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      // Swipe left, go next
      handleNext();
    }

    if (touchStart - touchEnd < -50) {
      // Swipe right, go previous
      handlePrev();
    }

    // Resume autoplay after 5 seconds
    setTimeout(() => setIsPaused(false), 5000);
  };

  // Pause auto-rotation when user interacts with controls
  const handleUserInteraction = () => {
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 5000);
  };

  // Auto-rotation
  useEffect(() => {
    if (!isPaused && isClient) {
      autoPlayRef.current = setInterval(() => {
        handleNext();
      }, 7000);
    }

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isPaused, isClient]);

  const getTransitionClass = (idx: number) => {
    if (!isClient) return "opacity-0";
    if (idx === activeIndex) return "opacity-100 translate-x-0";
    if (idx === 0 && activeIndex === cases.length - 1) return "opacity-0 translate-x-full";
    if (idx === cases.length - 1 && activeIndex === 0) return "opacity-0 -translate-x-full";
    return idx < activeIndex ? "opacity-0 -translate-x-full" : "opacity-0 translate-x-full";
  };

  return (
    <section id="use-cases" className="w-full max-w-5xl mx-auto my-20 px-4">
      <h2 className="text-2xl md:text-4xl font-bold mb-10 text-center">Use Cases</h2>

      <div className="relative w-full">
        {/* Carousel container with fixed layout */}
        <div
          className="relative w-full overflow-hidden"
          ref={containerRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Fixed height container */}
          <div className="w-full relative h-[400px] md:h-72">
            {cases.map((c, idx) => (
              <div
                key={idx}
                className={`absolute w-full transition-all duration-500 ease-in-out ${getTransitionClass(
                  idx
                )}`}
              >
                <div className="px-4 rounded-lg">
                  <h3 className="text-xl font-bold mb-1">{c.title}</h3>
                  <div className="text-sm text-pink-600 mb-4">{c.persona}</div>
                  <div className="space-y-4">
                    {c.story.map((s, i) => (
                      <p key={i} className={`${i === 0 ? "text-gray-700" : "text-gray-900"}`}>
                        {s}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Controls in a separate container */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-4">
          <button
            onClick={() => {
              handlePrev();
              handleUserInteraction();
            }}
            className="hidden md:flex items-center text-gray-700 py-2 hover:text-pink-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Previous
          </button>

          {/* Fixed position indicator dots container */}
          <div className="flex items-center gap-3 justify-center w-full md:w-auto">
            {cases.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActiveIndex(idx);
                  handleUserInteraction();
                }}
                className={`w-3 h-3 rounded-full ${
                  idx === activeIndex && isClient ? "bg-pink-500" : "bg-gray-300"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => {
              handleNext();
              handleUserInteraction();
            }}
            className="hidden md:flex items-center text-gray-700 py-2 hover:text-pink-600"
          >
            Next
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default UseCases;
