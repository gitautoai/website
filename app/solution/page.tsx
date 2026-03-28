"use client";

// Third-party imports
import Link from "next/link";
import { motion } from "framer-motion";

// Local imports
import { ABSOLUTE_URLS, RELATIVE_URLS } from "@/config/urls";

const STEPS = [
  {
    title: "Detect",
    detail: "untested files",
    description:
      "Imports coverage reports from CI artifacts. Any file not at 100% line, branch, and function coverage is a target.",
  },
  {
    title: "Learn",
    detail: "existing patterns",
    description:
      "Reads your test files to learn conventions - frameworks, assertion styles, mocks, and directory structure.",
  },
  {
    title: "Open",
    detail: "a pull request",
    description:
      "Creates a PR with a clear description and coverage report links. Zero manual work.",
  },
  {
    title: "Write",
    detail: "or update tests",
    description:
      "Generates test code following your repo's patterns. Creates new files or adds cases to existing ones.",
  },
  {
    title: "Run",
    detail: "CI pipeline",
    description:
      "Waits for GitHub Actions, CircleCI, or any CI. Reads the full logs to understand what happened.",
  },
  {
    title: "Fix",
    detail: "test failures",
    description:
      "Reads CI logs, identifies root cause, fixes test failures, ESLint errors, and type checker warnings. Repeats until green.",
  },
  {
    title: "Address",
    detail: "reviews",
    description:
      "Responds to human and bot reviewers. Resolves requested changes and code review feedback.",
  },
  {
    title: "Sync",
    detail: "branch",
    description:
      "Updates the PR branch when other PRs get merged. Resolves merge conflicts if they happen.",
  },
  {
    title: "Merge",
    detail: "auto or manual",
    description:
      "Auto-merges when all checks pass and only test files are changed, or you merge manually. Then starts the next file from step 1.",
  },
];

const COLORS = [
  "#e11d48", // rose-600
  "#db2777", // pink-600
  "#c026d3", // fuchsia-600
  "#a21caf", // fuchsia-700
  "#9333ea", // purple-600
  "#7c3aed", // violet-600
  "#6d28d9", // violet-700
  "#be185d", // pink-700
  "#e11d48", // rose-600 (loops back)
];

// Label positions around the ring (percentage-based for responsiveness)
function labelPosition(i: number) {
  const angle = ((i * 40 - 90) * Math.PI) / 180;
  const r = 42; // % from center
  return { x: 50 + r * Math.cos(angle), y: 50 + r * Math.sin(angle) };
}

function labelTransform(i: number) {
  const angle = i * 40; // 0=top, 180=bottom
  if (angle <= 10 || angle >= 350) return "translate(-50%, calc(-100% - 6px))"; // top
  if (angle >= 170 && angle <= 190) return "translate(-50%, 6px)"; // bottom
  if (angle > 10 && angle < 170) return "translate(6px, -50%)"; // right side
  return "translate(calc(-100% - 6px), -50%)"; // left side
}

function labelAlign(i: number): "center" | "left" | "right" {
  const angle = i * 40;
  if (angle <= 10 || angle >= 350) return "center";
  if (angle >= 170 && angle <= 190) return "center";
  if (angle > 10 && angle < 170) return "left";
  return "right";
}

export default function SolutionPage() {
  return (
    <div className="flex flex-col items-center pt-16 pb-24 max-w-6xl mx-auto px-4">
      {/* ── Hero ── */}
      <motion.h1
        className="text-4xl md:text-6xl font-bold mt-16 mb-5 text-center tracking-tight"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        The Full Automation Cycle
      </motion.h1>
      <motion.p
        className="text-lg md:text-xl text-gray-500 text-center mb-16 max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15 }}
      >
        Not just test writing. GitAuto handles the entire workflow from detection to merge - then
        does it again tomorrow.
      </motion.p>

      {/* ── Desktop: Smooth CSS gradient ring ── */}
      <motion.div
        className="hidden md:block w-full max-w-[500px]"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <div className="relative aspect-square">
          {/* Conic gradient ring */}
          <div
            className="absolute rounded-full"
            style={{
              inset: "18%",
              background:
                "conic-gradient(from -90deg, #e11d48, #db2777, #c026d3, #a21caf, #9333ea, #7c3aed, #6d28d9, #be185d, #e11d48)",
            }}
          >
            <div className="absolute rounded-full bg-white" style={{ inset: "2%" }} />
          </div>

          {/* Animated shine sweep */}
          <div
            className="absolute rounded-full animate-[spin_10s_linear_infinite]"
            style={{
              inset: "18%",
              background:
                "conic-gradient(from 0deg, transparent 84%, rgba(255,255,255,0.35) 91%, rgba(255,255,255,0.65) 94%, rgba(255,255,255,0.35) 97%, transparent 100%)",
            }}
          >
            <div className="absolute rounded-full bg-white" style={{ inset: "2%" }} />
          </div>

          {/* Step labels positioned around the ring */}
          {STEPS.map((step, i) => {
            const pos = labelPosition(i);
            return (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: labelTransform(i),
                  textAlign: labelAlign(i),
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: i * 0.08 + 0.5 }}
              >
                <div className="font-bold text-gray-900 text-xl whitespace-nowrap">
                  <span className="text-base font-semibold mr-1.5" style={{ color: COLORS[i] }}>
                    {i + 1}
                  </span>
                  {step.title}
                </div>
                <div className="text-base text-gray-400 whitespace-nowrap">{step.detail}</div>
              </motion.div>
            );
          })}

          {/* Center text */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.5 }}
          >
            <div className="text-4xl font-extrabold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              Every day
            </div>
            <div className="text-xs tracking-[4px] text-gray-400 mt-2 font-medium">
              FULLY AUTONOMOUS
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* ── Mobile: Timeline ── */}
      <div className="md:hidden w-full">
        {STEPS.map((step, i) => (
          <motion.div
            key={i}
            className="relative flex gap-4"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          >
            <div className="flex flex-col items-center">
              <div
                className="w-10 h-10 rounded-full bg-white border-2 flex items-center justify-center font-bold text-sm shadow-sm"
                style={{ borderColor: COLORS[i], color: COLORS[i] }}
              >
                {i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div className="w-px flex-1 bg-gradient-to-b from-pink-400 to-purple-400 opacity-30" />
              )}
            </div>
            <div className="pb-8 pt-2">
              <p className="font-bold text-gray-900">
                {step.title} <span className="font-normal text-gray-500">{step.detail}</span>
              </p>
              <p className="text-sm text-gray-500 mt-1">{step.description}</p>
            </div>
          </motion.div>
        ))}
        <div className="flex justify-center mt-2">
          <div className="text-sm font-semibold text-transparent bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text tracking-wide">
            Repeats every day
          </div>
        </div>
      </div>

      {/* ── Step details grid (desktop only, mobile has timeline above) ── */}
      <div className="hidden md:block w-full max-w-4xl mt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
          {STEPS.map((step, i) => (
            <motion.div
              key={i}
              className="flex gap-5"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
            >
              <span
                className="text-6xl font-black select-none leading-none shrink-0 tabular-nums"
                style={{ color: COLORS[i], opacity: 0.2 }}
              >
                {i + 1}
              </span>
              <div className="pt-1">
                <h3 className="font-bold text-gray-900 text-lg">
                  {step.title} <span className="font-normal text-gray-500">{step.detail}</span>
                </h3>
                <p className="text-gray-500 text-sm mt-1.5 leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── What this replaces ── */}
      <motion.div
        className="w-full max-w-2xl mt-24 text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-5">What this replaces</h2>
        <p className="text-gray-600 text-lg leading-relaxed">
          Without GitAuto, an engineer does every step manually: find untested files, study
          patterns, write tests, open a PR, wait for CI, debug failures, respond to reviews, and
          keep iterating. Even with AI coding tools, this takes about 2 hours per file.
        </p>
        <p className="text-gray-500 mt-4">
          See the{" "}
          <Link href={RELATIVE_URLS.ROI.CALCULATOR} className="text-pink-600 hover:underline">
            ROI Calculator
          </Link>{" "}
          to estimate what this saves for your team.
        </p>
      </motion.div>

      {/* ── CTAs ── */}
      <div className="flex flex-col sm:flex-row gap-3 mt-12">
        <Link
          href={ABSOLUTE_URLS.GITHUB.INSTALL_GITAUTO}
          target="_blank"
          className="text-center px-8 py-3 bg-pink-600 text-white rounded-lg font-semibold hover:bg-pink-700 transition-colors"
        >
          Start Free - $24 in Credits
        </Link>
        <Link
          href={RELATIVE_URLS.ROI.CALCULATOR}
          className="text-center px-8 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
        >
          ROI Calculator
        </Link>
      </div>
    </div>
  );
}
