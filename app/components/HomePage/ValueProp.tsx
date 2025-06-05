import InstallButton from "../Button/Install";

const ValueProp = () => {
  return (
    <div
      id="top"
      className="min-h-screen h-screen flex flex-col items-center justify-center gap-4 sm:gap-2 md:gap-4 text-center"
    >
      <h1 className="text-4xl sm:text-4xl md:text-6xl font-semibold bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent pb-1 mt-10 sm:mt-14 md:mt-10 sm:w-9/12 md:w-8/12 h-20 sm:h-20 md:h-32">
        GitAuto is a QA agent for GitHub
      </h1>
      <p className="text-lg sm:text-lg md:text-2xl lg:text-3xl">
        GitAuto creates unit test PRs, runs the tests, and fixes failures if any, to boost your test
        coverage from 0% to 90% – and keeps it there.
      </p>
      <InstallButton text="Get Started for Free" />
      <p className="text-base sm:text-sm md:text-base lg:text-lg">It requires GitHub sign-in.</p>
    </div>
  );
};

export default ValueProp;
