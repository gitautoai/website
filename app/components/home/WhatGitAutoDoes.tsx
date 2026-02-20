import { FaCogs, FaRocket, FaTools, FaChartLine } from "react-icons/fa";
import { motion } from "framer-motion";
import Link from "next/link";
import { RELATIVE_URLS } from "@/config/urls";

const whatItems = [
  {
    icon: <FaCogs className="text-pink-500 text-4xl mb-3" />,
    color: "text-pink-500",
    title: "Integrates with Your Coverage Reports",
    desc: "Connect your existing coverage reports to identify files that need testing. Works with any language and testing framework.",
    link: RELATIVE_URLS.DOCS.COVERAGE.OVERVIEW,
  },
  {
    icon: <FaRocket className="text-purple-500 text-4xl mb-3" />,
    color: "text-purple-500",
    title: "Automates Test Gen on Schedule",
    desc: "Set up repository rules and schedule triggers to automatically generate tests daily. GitAuto picks the lowest coverage files and creates PRs in your style.",
    link: RELATIVE_URLS.DOCS.TRIGGERS.OVERVIEW,
  },
  {
    icon: <FaTools className="text-red-500 text-4xl mb-3" />,
    color: "text-red-500",
    title: "Fixes Test Failures Automatically",
    desc: "When tests fail, GitAuto analyzes errors, updates code or tests, and retries until everything passes. No manual intervention needed.",
    link: RELATIVE_URLS.DOCS.TRIGGERS.TEST_FAILURE,
  },
  {
    icon: <FaChartLine className="text-green-500 text-4xl mb-3" />,
    color: "text-green-500",
    title: "Tracks Progress with Charts",
    desc: "Monitor your journey from low coverage to 90%+ with visual charts. See trends, celebrate wins, and stay motivated.",
    link: RELATIVE_URLS.DOCS.COVERAGE.CHARTS,
  },
];

const WhatGitAutoDoes = () => {
  return (
    <section
      id="what-gitauto-does"
      className="w-full mx-auto my-16 text-center"
      aria-label="What GitAuto Does section"
    >
      <h2 className="text-2xl md:text-4xl font-bold mb-10">What GitAuto Does</h2>
      <div className="flex flex-col md:flex-row gap-4 justify-center items-stretch">
        {whatItems.map((item, idx) => (
          <motion.div
            key={idx}
            className="flex-1 bg-white/90 rounded-xl shadow-md py-8 px-4 flex flex-col items-center transition-transform duration-200 hover:shadow-2xl relative"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{
              opacity: { duration: 0.7, delay: idx * 0.15, ease: "easeOut" },
              y: { duration: 0.7, delay: idx * 0.15, ease: "easeOut" },
              scale: { duration: 0, ease: "easeOut" },
            }}
          >
            {item.icon}
            <h3
              className={`${item.color} text-xl font-semibold mb-4 md:min-h-[56px] flex items-end justify-center`}
            >
              {item.title}
            </h3>
            <p className="text-lg text-gray-700 mb-4 flex-grow">{item.desc}</p>
            <Link
              href={item.link}
              className="text-base text-gray-500 hover:text-pink-600 underline mt-auto"
            >
              Learn more →
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default WhatGitAutoDoes;
