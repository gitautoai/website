import InstallButton from "../Button/Install";

const Hero = () => {
  return (
    <div
      id="top"
      className="min-h-screen h-screen flex flex-col items-center justify-center gap-2 sm:gap-2 md:gap-4 text-center"
    >
      <h1 className="text-4xl sm:text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent pb-0 mt-0 mb-0 sm:mt-14 md:mt-10 sm:w-12/12 md:w-11/12 h-32 sm:h-20 md:h-32">
        Go from 0% to 90%
        <br className="hidden sm:block" />
        Test Coverage on GitHub
      </h1>
      <p className="text-lg sm:text-lg md:text-2xl lg:text-3xl font-medium">
        GitAuto automatically writes, runs, and fixes your unit tests,
        <br className="hidden sm:block" /> so you can keep shipping confidently.
      </p>
      <InstallButton text="Start Free – Add to GitHub" />
      <p className="text-sm sm:text-xs md:text-sm lg:text-base text-gray-500 mt-2">
        No credit card required. Get started in seconds.
      </p>
    </div>
  );
};

export default Hero;
