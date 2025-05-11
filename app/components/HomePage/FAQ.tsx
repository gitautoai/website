import { useEffect, useState } from "react";
import ChevronIcon from "../Icon/Chevron";
import { FAQItem, FAQS } from "@/config/faqs";
import convertToLinks from "@/utils/convert-to-links";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [selectedFAQs, setSelectedFAQs] = useState<FAQItem[]>([]);

  // Randomly select N FAQs
  const N = 5;
  useEffect(() => {
    const randomFAQs = [...FAQS].sort(() => 0.5 - Math.random()).slice(0, N);
    setSelectedFAQs(randomFAQs);
  }, []);
  const handleToggle = (index: number) => setOpenIndex(openIndex === index ? null : index);

  return (
    <div
      id="faqs"
      className="min-h-screen h-full w-full md:w-10/12 flex flex-col items-center justify-center py-4 space-y-10"
    >
      <h2 className="text-3xl md:text-4xl">FAQs</h2>
      <div className="w-full mx-auto">
        {selectedFAQs.map((faq, index) => (
          <div key={index} className="w-full border-b border-gray-200 space-y-2 py-3">
            <button
              className="w-full text-left flex justify-between items-center gap-2"
              onClick={() => handleToggle(index)}
            >
              <span className={openIndex === index ? "text-pink-600 font-medium" : ""}>
                {faq.question}
              </span>
              <ChevronIcon isOpen={openIndex === index} />
            </button>
            <div className={`w-full ${openIndex === index ? "block" : "hidden"}`}>
              {convertToLinks(faq.answer)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
