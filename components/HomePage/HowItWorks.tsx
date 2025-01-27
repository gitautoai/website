import DemoVideo from "../Video/Demo";
import { RELATIVE_URLS } from "../../config";
import Link from "next/link";

const HowItWorks = () => {
  return (
    <div
      id="how-it-works"
      className="min-h-screen h-screen w-full flex flex-col items-center justify-center gap-4 sm:gap-10 md:gap-20"
    >
      <h2 className="text-3xl md:text-4xl">How it works</h2>
      <div className="w-full flex flex-col sm:flex sm:flex-row-reverse gap-4 sm:gap-4">
        <div className="w-full sm:w-6/12 md:w-7/12">
          <DemoVideo />
        </div>
        <ul className="list-decimal list-outside sm:w-6/12 md:w-5/12 pl-5 sm:pl-5 md:pl-5 space-y-0 sm:space-y-0 md:space-y-4">
          <li className="font-semibold">Write an issue or pick an existing one.</li>
          <li className="font-semibold">Run GitAuto to create a pull request by:</li>
          <ul className="list-disc list-outside pl-4 sm:pl-4 md:pl-5 space-y-0 sm:space-y-0 md:space-y-1">
            <li>Checking the checkbox in the issue comments.</li>
            <li>Or, label the issue with "gitauto".</li>
            <li>Or, it proactively runs every weekday.</li>
          </ul>
          <li className="font-semibold">Review the pull request.</li>
          <ul className="list-disc list-outside pl-4 sm:pl-4 md:pl-5 space-y-0 sm:space-y-0 md:space-y-1">
            <li>If it doesn&apos;t look good, update the issue content and rerun GitAuto.</li>
            <li>If it looks good, merge the pull request!</li>
          </ul>
          <li className="list-none">
            Here are the{" "}
            <Link
              href={RELATIVE_URLS.BLOG}
              className="text-pink-500 visited:text-pink-700 underline"
            >
              detailed case studies
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default HowItWorks;
