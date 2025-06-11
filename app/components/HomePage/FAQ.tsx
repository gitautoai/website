"use client";

// Third-party imports
import { useState } from "react";

// Local imports
import ChevronIcon from "@/app/components/Icon/Chevron";
import { FAQItem, FAQS } from "@/config/faqs";
import convertToLinks from "@/utils/convert-to-links";

const categoryMap = {
  // general: "General",
  features: "Features",
  language: "Language",
  permissions: "Permissions",
  pricing: "Pricing",
  data: "Data",
  privacy: "Privacy",
  // security: "Security",
  support: "Support",
};

const categorizedFAQs = FAQS.reduce((acc, faq) => {
  const category = faq.category;
  if (!acc[category]) acc[category] = [];
  acc[category].push(faq);
  return acc;
}, {} as Record<string, FAQItem[]>);

const FAQ = ({ initialCategory = "features" }) => {
  const [openIndex, setOpenIndex] = useState<Record<string, boolean>>({});
  const [activeCategory, setActiveCategory] = useState(initialCategory);

  const handleToggle = (category: string, index: number) => {
    setOpenIndex((prev) => ({
      ...prev,
      [`${category}-${index}`]: !prev[`${category}-${index}`],
    }));
  };

  return (
    <section id="faqs" className="w-full max-w-5xl mx-auto py-20 px-4">
      <h2 className="text-2xl md:text-4xl font-bold mb-6 text-center">
        Frequently Asked Questions
      </h2>

      {/* Category Buttons */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {Object.keys(categoryMap).map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === category
                ? "bg-pink-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {categoryMap[category as keyof typeof categoryMap]}
          </button>
        ))}
      </div>

      {/* FAQ Items */}
      <div className="w-full mx-auto divide-y divide-gray-200">
        {categorizedFAQs[activeCategory]?.map((faq, index) => (
          <div key={index} className="py-4">
            <button
              className="w-full text-left flex justify-between items-start gap-2"
              onClick={() => handleToggle(activeCategory, index)}
            >
              <span
                className={`${
                  openIndex[`${activeCategory}-${index}`]
                    ? "text-pink-600 font-medium"
                    : "text-gray-900"
                }`}
              >
                {faq.question}
              </span>
              <ChevronIcon isOpen={openIndex[`${activeCategory}-${index}`]} />
            </button>
            <div
              className={`mt-2 text-gray-600 ${
                openIndex[`${activeCategory}-${index}`] ? "block" : "hidden"
              }`}
            >
              {convertToLinks(faq.answer)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
