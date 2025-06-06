import { FaBug, FaRegClock, FaMagic } from "react-icons/fa";
import { motion } from "framer-motion";

const whyItems = [
  {
    icon: <FaBug className="text-pink-500 text-4xl mb-3" />,
    color: "text-pink-500",
    title: "Low Test Coverage Means More Bugs",
    desc: "Most teams struggle to keep up with unit tests. Low coverage leads to more bugs and slower releases.",
  },
  {
    icon: <FaRegClock className="text-purple-500 text-4xl mb-3" />,
    color: "text-purple-500",
    title: (
      <>
        No Tests, No Time,
        <br /> No Problem
      </>
    ),
    desc: "Many teams have little or no automated testing for their GitHub repositories. There's no time, no clear standard, and not enough resources to start from scratch.",
  },
  {
    icon: <FaMagic className="text-red-500 text-4xl mb-3" />,
    color: "text-red-500",
    title: "Let GitAuto Handle the Tedious Parts",
    desc: "Writing and maintaining tests isn't the most exciting work. GitAuto automates the boring parts, so you can focus on building features and shipping faster.",
  },
];

const WhyGitAuto = () => {
  return (
    <section className="w-full max-w-5xl mx-auto my-16 px-4 text-center">
      <h2 className="text-2xl md:text-4xl font-bold mb-10">Why GitAuto?</h2>
      <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch">
        {whyItems.map((item, idx) => (
          <motion.div
            key={idx}
            className="flex-1 bg-white/90 rounded-xl shadow-md p-8 flex flex-col items-center transition-transform duration-200 hover:scale-105 hover:shadow-2xl"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{
              duration: 0.7,
              delay: idx * 0.15,
              type: "tween",
              ease: "easeOut",
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
