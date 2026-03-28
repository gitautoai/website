// Third-party imports
import Link from "next/link";

// Local imports
import { CREDIT_PRICING, ROI_DEFAULTS } from "@/config/pricing";
import { RELATIVE_URLS } from "@/config/urls";

const COST_PER_PR = CREDIT_PRICING.PER_PR.AMOUNT_USD;
const HOURS_PER_TEST = ROI_DEFAULTS.HOURS_PER_TEST;
const WORK_DAYS = ROI_DEFAULTS.WORK_DAYS_PER_YEAR;
const WORK_HOURS = ROI_DEFAULTS.WORK_HOURS_PER_DAY;

const CA_SALARY = ROI_DEFAULTS.CALIFORNIA.ANNUAL_SALARY;
const CA_RATE = Math.round(CA_SALARY / (WORK_DAYS * WORK_HOURS));
const CA_SAVINGS_PER_PR = HOURS_PER_TEST * CA_RATE;
const CA_ROI = (CA_SAVINGS_PER_PR / COST_PER_PR).toPrecision(2);
const CA_MONTHLY = 50 * (CA_SAVINGS_PER_PR - COST_PER_PR);

const IN_SALARY = ROI_DEFAULTS.INDIA.ANNUAL_SALARY;
const IN_RATE = Math.round(IN_SALARY / (WORK_DAYS * WORK_HOURS));
const IN_SAVINGS_PER_PR = HOURS_PER_TEST * IN_RATE;
const IN_ROI = (IN_SAVINGS_PER_PR / COST_PER_PR).toPrecision(2);
const IN_MONTHLY = 50 * (IN_SAVINGS_PER_PR - COST_PER_PR);

export default function MethodologyPage() {
  return (
    <div className="flex flex-col items-center py-16 max-w-3xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-bold mt-16 mb-4">ROI Methodology</h1>
      <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl">
        How we calculate the return on investment for GitAuto.
      </p>

      <div className="w-full space-y-8 text-gray-700">
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">What is GitAuto&apos;s Value?</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Measurable</strong>: Reduced lead time, increased deployment frequency,
              shorter Failed Deployment Recovery Time (these align with{" "}
              <Link href="/blog/what-are-dora-metrics" className="text-pink-600 hover:underline">
                DORA metrics
              </Link>
              ).
            </li>
            <li>
              <strong>Monetary</strong>: Time saved per PR converted to cost savings, based on the
              number of PRs GitAuto generates.
            </li>
            <li>
              <strong>Intangible</strong>: Improved engineer satisfaction, reduced burnout, and
              better performance metrics for Engineering Managers and DevOps leads.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">The Formula</h2>
          <p>Separate qualitative and quantitative values for accurate ROI calculation:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Qualitative</strong>: Gather feedback via surveys or interviews.
            </li>
            <li>
              <strong>Quantitative</strong>: Focus on measurable values that can be converted to
              monetary terms.
            </li>
          </ul>
          <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm space-y-2">
            <p>Return = Savings per PR x Monthly usage</p>
            <p>Investment = ${COST_PER_PR} x Monthly usage</p>
            <p className="pt-2 border-t border-gray-200">
              ROI = Return / Investment = Savings per PR / ${COST_PER_PR}
            </p>
          </div>
          <p>
            The number of PRs cancels out. ROI depends only on how much time (and money) each PR
            saves compared to the ${COST_PER_PR} cost.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">How GitAuto Saves Time</h2>
          <p>
            Adding tests to a file isn&apos;t just writing code. The full cycle for each file
            includes:
          </p>
          <ol className="list-decimal pl-6 space-y-1">
            <li>Detecting which files lack coverage from your coverage reports</li>
            <li>Finding existing test patterns in your repo</li>
            <li>Opening a pull request</li>
            <li>Writing or updating test files with proper mocks, fixtures, and assertions</li>
            <li>Running CI and monitoring results</li>
            <li>Fixing test failures, linter errors, and type checker warnings</li>
            <li>Addressing review comments from humans and bots</li>
            <li>Syncing the PR branch when other PRs get merged</li>
            <li>Merging automatically when conditions are met, or you merge manually</li>
          </ol>
          <p>
            Even with AI coding tools, this{" "}
            <Link href={RELATIVE_URLS.SOLUTION} className="text-pink-600 hover:underline">
              full cycle
            </Link>{" "}
            typically takes ~{HOURS_PER_TEST} hours per file. GitAuto handles the entire workflow
            autonomously - and can run on a daily schedule, continuously improving your coverage
            without any manual effort.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">How GitAuto Saves Money</h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>
              <strong>Calculate your team&apos;s average hourly rate</strong>: For full-time teams,
              use a reasonable benchmark. For contractors, use your typical rates. Rough estimates
              work.
            </li>
            <li>
              <strong>Multiply by hours saved per PR</strong>: Hours saved = ~{HOURS_PER_TEST} hours
              (full cycle with AI coding tools) - negligible GitAuto time. Cost saved per PR =
              hourly rate x {HOURS_PER_TEST} hours.
            </li>
          </ol>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            Example: {ROI_DEFAULTS.CALIFORNIA.LABEL}
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg space-y-1 text-sm">
            <p>GitAuto cost: ${COST_PER_PR} per PR</p>
            <p>Monthly usage: 50 PRs</p>
            <p>Hours per file (full cycle with AI coding tools): {HOURS_PER_TEST}</p>
            <p>
              Engineer annual salary: ${CA_SALARY.toLocaleString()} (hourly: ${CA_RATE}/hr = $
              {CA_SALARY.toLocaleString()} / {WORK_DAYS} days / {WORK_HOURS} hours)
            </p>
          </div>
          <p>
            Savings per PR = {HOURS_PER_TEST}h x ${CA_RATE} = ${CA_SAVINGS_PER_PR}.{" "}
            <strong>
              ROI = ${CA_SAVINGS_PER_PR} / ${COST_PER_PR} = {CA_ROI}x
            </strong>
            . Monthly savings = 50 PRs x (${CA_SAVINGS_PER_PR} - ${COST_PER_PR}) ={" "}
            <strong>${CA_MONTHLY.toLocaleString()}</strong>.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            Example: {ROI_DEFAULTS.INDIA.LABEL}
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg space-y-1 text-sm">
            <p>GitAuto cost: ${COST_PER_PR} per PR</p>
            <p>Monthly usage: 50 PRs</p>
            <p>Hours per file (full cycle with AI coding tools): {HOURS_PER_TEST}</p>
            <p>
              Engineer annual salary: ${IN_SALARY.toLocaleString()} (hourly: ${IN_RATE}/hr = $
              {IN_SALARY.toLocaleString()} / {WORK_DAYS} days / {WORK_HOURS} hours)
            </p>
          </div>
          <p>
            Savings per PR = {HOURS_PER_TEST}h x ${IN_RATE} = ${IN_SAVINGS_PER_PR}.{" "}
            <strong>
              ROI = ${IN_SAVINGS_PER_PR} / ${COST_PER_PR} = {IN_ROI}x
            </strong>
            . Monthly savings = 50 PRs x (${IN_SAVINGS_PER_PR} - ${COST_PER_PR}) ={" "}
            <strong>${IN_MONTHLY.toLocaleString()}</strong>.
          </p>
          <p>Even compared to India&apos;s competitive rates, GitAuto provides compelling ROI.</p>
        </section>

        <div className="pt-8 text-center">
          <Link
            href="/roi/calculator"
            className="inline-block px-8 py-3 bg-pink-600 text-white rounded-lg font-semibold hover:bg-pink-700 transition-colors"
          >
            Try the ROI Calculator
          </Link>
        </div>
      </div>
    </div>
  );
}
