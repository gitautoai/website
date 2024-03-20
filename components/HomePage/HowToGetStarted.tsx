export default function HowToGetStarted() {
  return (
    <div className="bg-light text-black w-[100vw] flex flex-col py-16 px-8">
      <div className="flex flex-col items-center">
        <h2 className="text-center text-3xl font-helvetica font-medium">
          How to get started
        </h2>
        <div className=" flex flex-col gap-5 mt-5">
          <span>&bull; Install our Github App</span>
          <span>&bull; Select the repositories you would like to activate</span>
          <span>
            &bull; Create an issue such as a bug report or feature request.
          </span>
          <span>
            &bull; Click the checkbox in GitAuto&apos;s comment to generate a PR
          </span>
          <span>
            &bull; Voila, your PR will soon be created. The progress is
            reflected in the comment
          </span>
        </div>
      </div>
    </div>
  );
}
