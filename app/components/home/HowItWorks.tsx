// Third-party imports
import Link from "next/link";
import { FaUpload, FaRobot, FaCodeBranch, FaChartLine } from "react-icons/fa";

// Local imports
import { RELATIVE_URLS } from "@/config/urls";

const steps = [
  {
    icon: <FaUpload className="text-pink-500 text-3xl" />,
    title: "Coverage Reports Uploaded",
    desc: (
      <>
        Your CI/CD uploads coverage reports. GitAuto identifies low-coverage files.{" "}
        <Link href={RELATIVE_URLS.DOCS.COVERAGE.OVERVIEW} className="text-pink-500 underline">
          Setup guide →
        </Link>
      </>
    ),
  },
  {
    icon: <FaRobot className="text-purple-500 text-3xl" />,
    title: "Tests Generated Daily",
    desc: (
      <>
        GitAuto automatically picks files and generates tests using your repository rules.{" "}
        <Link href={RELATIVE_URLS.SETTINGS.RULES} className="text-purple-500 underline">
          Setup rules →
        </Link>
      </>
    ),
  },
  {
    icon: <FaCodeBranch className="text-red-500 text-3xl" />,
    title: "PRs Created & Fixed",
    desc: (
      <>
        Pull requests are opened with tests. If they fail, GitAuto fixes them automatically.{" "}
        <Link href={RELATIVE_URLS.DOCS.TRIGGERS.TEST_FAILURE} className="text-red-500 underline">
          Learn more →
        </Link>
      </>
    ),
  },
  {
    icon: <FaChartLine className="text-green-500 text-3xl" />,
    title: "Coverage Improves",
    desc: (
      <>
        You review and merge PRs. Watch your coverage climb to 90%+ over time.{" "}
        <Link href={RELATIVE_URLS.DASHBOARD.CHARTS} className="text-green-500 underline">
          View charts →
        </Link>
      </>
    ),
  },
];

const HowItWorks = () => {
  return (
    <section
      id="how-it-works"
      className="w-full max-w-6xl mx-auto my-20 px-4"
      aria-label="How It Works section"
    >
      <h2 className="text-2xl md:text-4xl font-bold mb-14 text-center">How It Works</h2>
      <div className="flex flex-col items-center">
        {/* Timeline */}
        <div className="flex flex-col gap-0 md:gap-0 relative max-w-2xl">
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
      </div>
    </section>
  );
};

export default HowItWorks;
