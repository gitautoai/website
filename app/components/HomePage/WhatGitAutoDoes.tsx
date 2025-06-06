import { FaRobot, FaCodeBranch, FaTools, FaChartLine } from "react-icons/fa";
import { motion } from "framer-motion";

const whatItems = [
  {
    icon: <FaRobot className="text-pink-500 text-4xl mb-3" />,
    color: "text-pink-500",
    title: "Generates Unit Tests When Asked",
    desc: "Trigger GitAuto by specifying a file in an issue, from the dashboard, or with a review comment.",
  },
  {
    icon: <FaCodeBranch className="text-purple-500 text-4xl mb-3" />,
    color: "text-purple-500",
    title: "Opens PRs and Runs Tests",
    desc: "GitAuto opens a pull request for the new tests, and runs them with GitHub Actions. You review and merge when ready.",
  },
  {
    icon: <FaTools className="text-red-500 text-4xl mb-3" />,
    color: "text-red-500",
    title: "Fixes Test Failures Automatically",
    desc: "If a generated test fails, GitAuto checks the error, analyzes the cause, updates code or tests, and retries until it passes.",
  },
  {
    icon: <FaChartLine className="text-green-500 text-4xl mb-3" />,
    color: "text-green-500",
    title: "Maintains High Test Coverage",
    desc: "GitAuto can also add missing tests after commits, merges, or on a schedule to keep your coverage high as your project grows.",
  },
];

const WhatGitAutoDoes = () => {
  return (
    <section className="w-full max-w-5xl mx-auto my-16 px-4 text-center">
      <h2 className="text-2xl md:text-4xl font-bold mb-10">What GitAuto Does</h2>
      <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch">
        {whatItems.map((item, idx) => (
          <motion.div
            key={idx}
            className="flex-1 bg-white/90 rounded-xl shadow-md py-8 px-4 flex flex-col items-center transition-transform duration-200 hover:shadow-2xl"
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
            <p className="text-lg text-gray-700">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default WhatGitAutoDoes;
