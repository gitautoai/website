import { FaBug, FaMagic, FaClock } from "react-icons/fa";
import { motion } from "framer-motion";

const whyItems = [
  {
    icon: <FaBug className="text-pink-500 text-4xl mb-3" />,
    color: "text-pink-500",
    title: "Low Test Coverage Means More Bugs",
    desc: "Most teams struggle to maintain high test coverage. Low coverage leads to more bugs, slower releases, and reduced confidence in deployments.",
  },
  {
    icon: <FaClock className="text-purple-500 text-4xl mb-3" />,
    color: "text-purple-500",
    title: (
      <>
        No Tests, No Time,
        <br /> No Problem
      </>
    ),
    desc: "But explaining your testing standards and writing comprehensive tests are still time-consuming and often gets deprioritized, even with current AI tools.",
  },
  {
    icon: <FaMagic className="text-red-500 text-4xl mb-3" />,
    color: "text-red-500",
    title: "Set It Up Once, Reach 90%+ Coverage",
    desc: "Connect your coverage reports, configure repository rules, enable schedule triggers. GitAuto works 24/7 to automatically improve your coverage while you focus on building features.",
  },
];

const WhyGitAuto = () => {
  return (
    <section
      id="why-gitauto"
      className="w-full max-w-5xl mx-auto my-16 px-4 text-center"
      aria-label="Why GitAuto section"
    >
      <h2 className="text-2xl md:text-4xl font-bold mb-10">Why GitAuto?</h2>
      <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch">
        {whyItems.map((item, idx) => (
          <motion.div
            key={idx}
            className="flex-1 bg-white/90 rounded-xl shadow-md p-8 flex flex-col items-center transition-transform duration-200 hover:scale-105 hover:shadow-2xl"
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
              className={`${item.color} text-xl font-semibold mb-4 min-h-[56px] flex items-end justify-center`}
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

export default WhyGitAuto;
