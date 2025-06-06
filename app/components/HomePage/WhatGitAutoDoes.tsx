import { FaRobot, FaCodeBranch, FaTools, FaChartLine } from "react-icons/fa";

const WhatGitAutoDoes = () => {
  return (
    <section className="w-full max-w-5xl mx-auto my-16 px-4 text-center">
      <h2 className="text-2xl md:text-4xl font-bold mb-10">What GitAuto Does</h2>
      <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch">
        {/* 1. Test Generation Triggered by You */}
        <div className="flex-1 bg-white/90 rounded-xl shadow-md py-8 px-4 flex flex-col items-center transition-transform duration-200 hover:scale-105 hover:shadow-2xl">
          <FaRobot className="text-pink-500 text-4xl mb-3" />
          <h3 className="text-pink-500 text-xl font-semibold mb-4 md:min-h-[56px] flex items-end justify-center">
            Generates Unit Tests When Asked
          </h3>
          <p className="text-lg text-gray-700">
            Trigger GitAuto by specifying a file in an issue, from the dashboard, or with a review
            comment.
          </p>
        </div>

        {/* 2. PR Creation & Test Execution */}
        <div className="flex-1 bg-white/90 rounded-xl shadow-md py-8 px-4 flex flex-col items-center transition-transform duration-200 hover:scale-105 hover:shadow-2xl">
          <FaCodeBranch className="text-purple-500 text-4xl mb-3" />
          <h3 className="text-purple-500 text-xl font-semibold mb-4 md:min-h-[56px] flex items-end justify-center">
            Opens PRs and Runs Tests
          </h3>
          <p className="text-lg text-gray-700">
            GitAuto opens a pull request for the new tests, and runs them with GitHub Actions. You
            review and merge when ready.
          </p>
        </div>

        {/* 3. Auto-Fix for Test Failures */}
        <div className="flex-1 bg-white/90 rounded-xl shadow-md py-8 px-4 flex flex-col items-center transition-transform duration-200 hover:scale-105 hover:shadow-2xl">
          <FaTools className="text-red-500 text-4xl mb-3" />
          <h3 className="text-red-500 text-xl font-semibold mb-4 md:min-h-[56px] flex items-end justify-center">
            Fixes Test Failures Automatically
          </h3>
          <p className="text-lg text-gray-700">
            If a generated test fails, GitAuto checks the error, analyzes the cause, updates code or
            tests, and retries until it passes.
          </p>
        </div>

        {/* 4. Maintains High Coverage */}
        <div className="flex-1 bg-white/90 rounded-xl shadow-md py-8 px-4 flex flex-col items-center transition-transform duration-200 hover:scale-105 hover:shadow-2xl">
          <FaChartLine className="text-green-500 text-4xl mb-3" />
          <h3 className="text-green-500 text-xl font-semibold mb-4 md:min-h-[56px] flex items-end justify-center">
            Maintains High Test Coverage
          </h3>
          <p className="text-lg text-gray-700">
            GitAuto can also add missing tests after commits, merges, or on a schedule to keep your
            coverage high as your project grows.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhatGitAutoDoes;
