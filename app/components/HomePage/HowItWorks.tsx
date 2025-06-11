// Third-party imports
import Link from "next/link";
import { FaTachometerAlt, FaListAlt, FaFileAlt, FaCheckCircle } from "react-icons/fa";

// Local imports
import DemoVideo from "../Video/Demo";
import { RELATIVE_URLS } from "@/config";

const steps = [
  {
    icon: <FaTachometerAlt className="text-pink-500 text-3xl" />,
    title: "Go to the Dashboard",
    desc: (
      <>
        Visit your{" "}
        <Link href={RELATIVE_URLS.COVERAGES} className="text-pink-500 underline">
          coverage dashboard
        </Link>{" "}
        to see which files need more tests.
      </>
    ),
  },
  {
    icon: <FaListAlt className="text-purple-500 text-3xl" />,
    title: "Select Files",
    desc: "Choose one or more files you want to improve coverage for.",
  },
  {
    icon: <FaFileAlt className="text-red-500 text-3xl" />,
    title: "Create Issue or PR",
    desc: "With one click, create an issue or both an issue and a pull request for each selected file.",
  },
  {
    icon: <FaCheckCircle className="text-green-500 text-3xl" />,
    title: "Review & Merge",
    desc: "Once tests pass, review the code and merge the pull request.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="w-full max-w-6xl mx-auto my-20 px-4">
      <h2 className="text-2xl md:text-4xl font-bold mb-14 text-center">How It Works</h2>
      <div className="flex flex-col md:flex-row items-center gap-12">
        {/* Timeline */}
        <div className="flex-1 flex flex-col gap-0 md:gap-0 relative">
          {steps.map((step, idx) => (
            <div key={idx} className="flex items-start mb-0 md:mb-0">
              <div className="flex flex-col items-center mr-6">
                <div className="bg-white rounded-full shadow-lg p-4">{step.icon}</div>
                {idx < steps.length - 1 && (
                  <div className="w-1 h-16 md:h-12 bg-gradient-to-b from-pink-400 to-purple-400" />
                )}
              </div>
              <div className="text-left pt-4.5">
                <h3 className="text-lg font-semibold mb-1">{step.title}</h3>
                <p className="text-base text-gray-700">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
        {/* Video (for reference) */}
        <div className="flex-1 hidden md:block">
          <DemoVideo />
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
