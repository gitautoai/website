import InstallButton from "../Button/Install";

const ValueProp = () => {
  return (
    <div
      id="top"
      className="h-screen flex flex-col items-center justify-center gap-8 md:gap-6 lg:gap-8 xl:gap-10"
    >
      <div className="flex flex-col gap-4 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent pb-1 mt-10">
          Let your AI Coding Agent writes code.
          {/* Let your AI coding agent resolve your issues.
            Let your AI coding agent fix your bugs.
            Let your AI coding agent develop your features.
            Hire your AI coding agent. */}
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl">
          GitAuto automatically writes code and creates pull requests daily for your issues on
          GitHub, fixing more bugs and shipping more features.
        </p>
        <InstallButton text="Get Started for Free" />
      </div>
    </div>
  );
};

export default ValueProp;
