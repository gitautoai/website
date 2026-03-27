// Third-party imports
import Link from "next/link";

// Local imports
import { CREDIT_PRICING } from "@/config/pricing";

const COST_PER_PR = CREDIT_PRICING.PER_PR.AMOUNT_USD;

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
            Writing tests manually is one of the most time-consuming parts of software development:
          </p>
          <ol className="list-decimal pl-6 space-y-1">
            <li>Reading the source file, understanding dependencies, identifying what to test</li>
            <li>Setting up mocks, fixtures, and assertions for each code path</li>
            <li>Running tests, debugging failures, adjusting mocks, ensuring coverage</li>
          </ol>
          <p>
            This typically takes 2-4 hours per file. GitAuto generates a test PR in minutes -
            roughly <strong>60x faster</strong>.
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
              <strong>Multiply by hours saved per PR</strong>: Hours saved = ~3 hours (typical
              manual time) - negligible GitAuto time. Cost saved per PR = hourly rate x ~3 hours.
            </li>
          </ol>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">Example: California</h2>
          <div className="bg-gray-50 p-4 rounded-lg space-y-1 text-sm">
            <p>GitAuto cost: ${COST_PER_PR} per PR</p>
            <p>Monthly usage: 50 PRs</p>
            <p>Time to write tests manually: 3 hours</p>
            <p>Engineer hourly rate: $71/hour (entry-level, California)</p>
          </div>
          <p>
            Savings per PR = 3h x $71 = $213. <strong>ROI = $213 / ${COST_PER_PR} = 27x</strong>.
            Monthly savings = 50 PRs x ($213 - ${COST_PER_PR}) = <strong>$10,250</strong>.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">Example: India</h2>
          <div className="bg-gray-50 p-4 rounded-lg space-y-1 text-sm">
            <p>GitAuto cost: ${COST_PER_PR} per PR</p>
            <p>Monthly usage: 50 PRs</p>
            <p>Time to write tests manually: 3 hours</p>
            <p>Engineer hourly rate: $11/hour (entry-level contractor, India)</p>
          </div>
          <p>
            Savings per PR = 3h x $11 = $33. <strong>ROI = $33 / ${COST_PER_PR} = 4x</strong>.
            Monthly savings = 50 PRs x ($33 - ${COST_PER_PR}) = <strong>$1,250</strong>.
          </p>
          <p>
            Even compared to India&apos;s competitive contractor rates, GitAuto provides compelling
            ROI.
          </p>
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
