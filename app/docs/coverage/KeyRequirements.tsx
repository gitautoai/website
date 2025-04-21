"use client";

interface KeyRequirementsProps {
  className?: string;
}

export function KeyRequirements({ className = "" }: KeyRequirementsProps) {
  return (
    <div className={`bg-yellow-50 p-4 rounded-lg mb-6 ${className}`}>
      <h3 className="text-lg font-medium text-yellow-950 mb-2">Key Requirements</h3>
      <ul className="list-disc list-outside space-y-1 text-yellow-800 ml-5">
        <li>Coverage report must be in LCOV format</li>
        <li>
          Report must be saved as <code className="bg-yellow-100 px-1">coverage/lcov.info</code>
        </li>
        <li>
          Report must be uploaded as a GitHub Actions artifact named{" "}
          <code className="bg-yellow-100 px-1">coverage-report</code>
        </li>
      </ul>
    </div>
  );
}
