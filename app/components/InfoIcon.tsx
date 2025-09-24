"use client";

export default function InfoIcon({ tooltip }: { tooltip: string }) {
  return (
    <span className="ml-2 group relative inline-block">
      <svg
        className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span className="invisible group-hover:visible absolute z-10 bg-gray-900 text-white text-xs rounded-lg p-2 w-64 bottom-full left-1/2 transform -translate-x-1/2 mb-2 font-normal">
        {tooltip}
        <span className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
          <span className="border-4 border-transparent border-t-gray-900"></span>
        </span>
      </span>
    </span>
  );
}