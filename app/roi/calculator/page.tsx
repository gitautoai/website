"use client";

// Third-party imports
import Link from "next/link";
import { useState } from "react";

// Local imports
import { CREDIT_PRICING, ROI_DEFAULTS } from "@/config/pricing";
import { ABSOLUTE_URLS, RELATIVE_URLS } from "@/config/urls";

const COST_PER_PR = CREDIT_PRICING.PER_PR.AMOUNT_USD;

export default function ROICalculatorPage() {
  const [fileCount, setFileCount] = useState(100);
  const [currentCoverage, setCurrentCoverage] = useState(20);
  const [targetCoverage, setTargetCoverage] = useState(80);
  const [annualSalary, setAnnualSalary] = useState(ROI_DEFAULTS.CALIFORNIA.ANNUAL_SALARY);
  const [hoursPerTest, setHoursPerTest] = useState(ROI_DEFAULTS.HOURS_PER_TEST);

  const hourlyRate = Math.round(
    annualSalary / (ROI_DEFAULTS.WORK_DAYS_PER_YEAR * ROI_DEFAULTS.WORK_HOURS_PER_DAY),
  );
  // Approximation: coverage % is line coverage, not file coverage. The actual number depends on how coverage is distributed across files. This assumes uniform distribution as a rough estimate.
  const filesNeedingTests = Math.max(
    0,
    Math.round((fileCount * (targetCoverage - currentCoverage)) / 100),
  );
  const gitautoCost = filesNeedingTests * COST_PER_PR;
  const manualCost = filesNeedingTests * hoursPerTest * hourlyRate;
  const savings = manualCost - gitautoCost;
  const roiMultiplier = gitautoCost > 0 ? manualCost / gitautoCost : 0;

  return (
    <div className="flex flex-col items-center py-16 max-w-4xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-bold mt-16 mb-4">ROI Calculator</h1>
      <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl">
        Estimate how much time and money GitAuto saves by generating tests for your repository.
      </p>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Inputs */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold mb-4">Your Repository</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Source files that need testing
            </label>
            <input
              type="number"
              value={fileCount}
              onChange={(e) => setFileCount(Math.max(0, Number(e.target.value)))}
              min={0}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Count your source files (e.g. <code>find src -name &quot;*.ts&quot; | wc -l</code>)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current test coverage (%)
            </label>
            <input
              type="number"
              value={currentCoverage}
              onChange={(e) =>
                setCurrentCoverage(Math.min(100, Math.max(0, Number(e.target.value))))
              }
              min={0}
              max={100}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target test coverage (%)
            </label>
            <input
              type="number"
              value={targetCoverage}
              onChange={(e) =>
                setTargetCoverage(Math.min(100, Math.max(0, Number(e.target.value))))
              }
              min={0}
              max={100}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <h2 className="text-xl font-semibold mb-4 pt-4">Your Team</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Engineer annual salary ($)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">$</span>
              <input
                type="text"
                inputMode="numeric"
                value={annualSalary.toLocaleString()}
                onChange={(e) =>
                  setAnnualSalary(Math.max(0, Number(e.target.value.replace(/,/g, "")) || 0))
                }
                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Hourly rate: ${hourlyRate}/hr (salary / 260 days / 8 hours)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hours per file (with AI coding tools)
            </label>
            <input
              type="number"
              value={hoursPerTest}
              onChange={(e) => setHoursPerTest(Math.max(0, Number(e.target.value)))}
              min={0}
              step={0.5}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Detect untested file, find existing tests, open PR, write tests, run CI, fix failures,
              address reviews, sync branch, and merge.{" "}
              <Link href={RELATIVE_URLS.SOLUTION} className="text-pink-600 hover:underline">
                See the full cycle
              </Link>
            </p>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold mb-4">Results</h2>

          <div className="bg-gray-50 p-6 rounded-lg space-y-4">
            <div>
              <p className="text-sm text-gray-500">Files needing new tests (estimate)</p>
              <p className="text-2xl font-bold">{filesNeedingTests.toLocaleString()}</p>
              <p className="text-xs text-gray-400">
                Your coverage gap is {targetCoverage - currentCoverage}%, so roughly{" "}
                {targetCoverage - currentCoverage}% of your {fileCount.toLocaleString()} files need
                new or improved tests. This is a simplified estimate since coverage is measured per
                line, not per file.
              </p>
            </div>

            <hr className="border-gray-200" />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Manual cost</p>
                <p className="text-xl font-semibold text-gray-700">
                  ${manualCost.toLocaleString()}
                </p>
                <p className="text-xs text-gray-400">
                  {filesNeedingTests.toLocaleString()} files x {hoursPerTest}h x ${hourlyRate}/hr
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">GitAuto cost</p>
                <p className="text-xl font-semibold text-pink-600">
                  ${gitautoCost.toLocaleString()}
                </p>
                <p className="text-xs text-gray-400">
                  {filesNeedingTests.toLocaleString()} files x ${COST_PER_PR}
                </p>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div>
              <p className="text-sm text-gray-500">Your savings</p>
              <p className="text-3xl font-bold text-green-600">${savings.toLocaleString()}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">ROI</p>
              <p className="text-3xl font-bold text-pink-600">{roiMultiplier.toPrecision(2)}x</p>
              <p className="text-xs text-gray-400">
                Every $1 spent on GitAuto saves ${roiMultiplier.toPrecision(2)} in engineer time
              </p>
            </div>

            <hr className="border-gray-200" />

            <div>
              <p className="text-sm text-gray-500">Engineer hours saved</p>
              <p className="text-xl font-semibold">
                {(filesNeedingTests * hoursPerTest).toLocaleString()} hours
              </p>
              <p className="text-xs text-gray-400">
                That&apos;s {Math.round((filesNeedingTests * hoursPerTest) / 8)} work days
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col gap-3">
            <Link
              href={ABSOLUTE_URLS.GITHUB.INSTALL_GITAUTO}
              target="_blank"
              className="w-full text-center px-6 py-3 bg-pink-600 text-white rounded-lg font-semibold hover:bg-pink-700 transition-colors"
            >
              Start Free - $24 in Credits
            </Link>
            <Link
              href={RELATIVE_URLS.PRICING_DETAILS}
              className="w-full text-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              View Pricing Details
            </Link>
          </div>
        </div>
      </div>

      {/* Methodology link */}
      <div className="mt-12 text-center text-sm text-gray-500">
        <p>
          Learn how we calculate ROI in our{" "}
          <Link href="/roi/methodology" className="text-pink-600 hover:underline">
            methodology breakdown
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
