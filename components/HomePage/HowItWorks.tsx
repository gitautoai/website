import DemoVideo from "../Video/Demo";

const HowItWorks = () => {
  return (
    <div
      id="how-it-works"
      className="h-screen w-full flex flex-col items-center justify-center gap-6 md:gap-20"
    >
      <h2 className="text-3xl md:text-4xl">How it works</h2>
      <div className="w-full flex flex-col gap-6 md:flex md:flex-row-reverse md:gap-4">
        <div className="w-full md:w-7/12">
          <DemoVideo />
        </div>
        <ul className="list-decimal list-inside md:w-5/12 space-y-1 md:space-y-4">
          <li className="font-semibold">Write an issue or pick an existing one.</li>
          <li className="font-semibold">Run GitAuto to create a pull request by:</li>
          <ul className="list-disc list-outside pl-9 md:pl-11 md:space-y-1">
            <li>Checking the checkbox in the issue comments.</li>
            <li>Or, label the issue with “gitauto”.</li>
            <li>Or, it proactively runs every weekday.</li>
          </ul>
          <li className="font-semibold">Review the pull request.</li>
          <ul className="list-disc list-outside pl-9 md:pl-11 md:space-y-1">
            <li>If it doesn&apos;t look good, update the issue content and rerun GitAuto.</li>
            <li>If it looks good, merge the pull request!</li>
          </ul>
        </ul>
      </div>
    </div>
  );
};

export default HowItWorks;
