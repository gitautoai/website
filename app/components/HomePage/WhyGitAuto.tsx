import { FaBug, FaRegClock, FaMagic } from "react-icons/fa";

const WhyGitAuto = () => {
  return (
    <section className="w-full max-w-5xl mx-auto my-16 px-4 text-center">
      <h2 className="text-2xl md:text-4xl font-bold mb-10">Why GitAuto?</h2>
      <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch">
        {/* 1. Low Coverage */}
        <div className="flex-1 bg-white/90 rounded-xl shadow-md p-8 flex flex-col items-center transition-transform duration-200 hover:scale-105 hover:shadow-2xl">
          <FaBug className="text-pink-500 text-4xl mb-3" />
          <h3 className="text-xl text-pink-500 font-semibold mb-4 min-h-[56px] flex items-end justify-center">
            Low Test Coverage Means More Bugs
          </h3>
          <p className="text-lg text-gray-700">
            Most teams struggle to keep up with unit tests. Low coverage leads to more bugs and
            slower releases.
          </p>
        </div>

        {/* 2. No Tests, No Time, No Problem */}
        <div className="flex-1 bg-white/90 rounded-xl shadow-md p-8 flex flex-col items-center transition-transform duration-200 hover:scale-105 hover:shadow-2xl">
          <FaRegClock className="text-purple-500 text-4xl mb-3" />
          <h3 className="text-xl text-purple-500 font-semibold mb-4 min-h-[56px] flex items-end justify-center">
            No Tests, No Time,
            <br /> No Problem
          </h3>
          <p className="text-lg text-gray-700">
            Many teams have little or no automated testing for their GitHub repositories.
            There&apos;s no time, no clear standard, and not enough resources to start from scratch.
          </p>
        </div>

        {/* 3. Let GitAuto Handle the Tedious Parts */}
        <div className="flex-1 bg-white/90 rounded-xl shadow-md p-8 flex flex-col items-center transition-transform duration-200 hover:scale-105 hover:shadow-2xl">
          <FaMagic className="text-red-500 text-4xl mb-3" />
          <h3 className="text-xl text-red-500 font-semibold mb-4 min-h-[56px] flex items-end justify-center">
            Let GitAuto Handle the Tedious Parts
          </h3>
          <p className="text-lg text-gray-700">
            Writing and maintaining tests isn&apos;t the most exciting work. GitAuto automates the
            boring parts, so you can focus on building features and shipping faster.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhyGitAuto;
