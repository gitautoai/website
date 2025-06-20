"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { RELATIVE_URLS } from "@/config/urls";

interface JiraHeaderProps {
  isConnected: boolean;
  isConnecting: boolean;
  onAuth: () => void;
}

const description = [
  "Create GitHub pull requests directly from Jira tickets.",
  "Connect your Jira projects with GitHub repositories.",
  "Manage multiple project integrations.",
  "Toggle integration on/off at any time.",
  <>
    Need help? Contact us{" "}
    <Link href={RELATIVE_URLS.CONTACT} className="text-pink-500 visited:text-pink-700 underline">
      here
    </Link>
    .
  </>,
  <>
    For detailed instructions with images, please visit our{" "}
    <Link
      href="/blog/how-to-open-pull-requests-from-jira-issues"
      className="text-pink-500 visited:text-pink-700 underline"
    >
      guide
    </Link>
    .
  </>,
];

export function JiraHeader({ isConnected, isConnecting, onAuth }: JiraHeaderProps) {
  const { data: session } = useSession();

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 md:gap-8 items-center justify-center">
      {/* Left side: Logo and connect button */}
      <div className="text-center flex flex-col items-center space-y-8 md:col-span-2">
        <div className="flex items-center justify-center mt-4">
          <Image
            src="/icons/jira.png"
            alt="Jira Logo"
            width={160}
            height={160}
            className="rounded-lg object-contain w-[120px] md:w-[160px]"
          />
        </div>
        <button
          onClick={onAuth}
          disabled={isConnecting || !session}
          className={`${
            isConnected ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
          } text-white px-4 py-2 rounded disabled:opacity-50`}
        >
          {isConnecting
            ? "Processing..."
            : isConnected
              ? "Disconnect from Jira"
              : "Connect with Jira"}
        </button>
      </div>

      {/* Right side: Feature description */}
      <div className="md:col-span-3">
        <h2 className="text-xl font-semibold mb-4">Description of Jira Integration</h2>
        <ul className="list-disc list-outside space-y-1 md:space-y-1 py-2 pl-8 md:pl-4 text-base md:text-lg">
          {description.map((item, index) => (
            <li key={index} className="list-item">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
