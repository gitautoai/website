import { useEffect, useState } from "react";
import InstallButton from "../Button/Install";
import { TAGLINES } from "@/config";

const ValueProp = () => {
  const [currentTaglineIndex, setCurrentTaglineIndex] = useState(0);
  // const [displayedTagline, setDisplayedTagline] = useState("");

  // Change tagline every X seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTaglineIndex((prevIndex) =>
        prevIndex === TAGLINES.length - 1 ? 0 : prevIndex + 1
      );
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  // Type tagline every Y seconds
  // useEffect(() => {
  //   let currentIndex = 0;
  //   let timeout: NodeJS.Timeout;
  //   const typeTagline = () => {
  //     if (currentIndex < TAGLINES[currentTaglineIndex].length) {
  //       setDisplayedTagline(() => TAGLINES[currentTaglineIndex].slice(0, currentIndex));
  //       currentIndex++;
  //       timeout = setTimeout(typeTagline, 1); // Typing speed
  //     } else {
  //       clearTimeout(timeout);
  //     }
  //   };

  //   // Reset displayed tagline and type it
  //   setDisplayedTagline("");
  //   typeTagline();

  //   return () => clearTimeout(timeout);
  // }, [currentTaglineIndex]);

  return (
    <div
      id="top"
      className="min-h-screen h-screen flex flex-col items-center justify-center gap-4 sm:gap-2 md:gap-4 text-center"
    >
      <h1 className="text-4xl sm:text-4xl md:text-6xl font-semibold bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent pb-1 mt-10 sm:mt-14 md:mt-10 sm:w-9/12 md:w-9/12 h-32 sm:h-20 md:h-32">
        {TAGLINES[currentTaglineIndex]}
      </h1>
      <p className="text-lg sm:text-lg md:text-2xl lg:text-3xl">
        GitAuto writes code and opens pull requests from GitHub & Jira issues for automated test case creation.
      </p>
      <InstallButton text="Get Started for Free" />
      <p className="text-base sm:text-sm md:text-base lg:text-lg">It requires GitHub sign-in.</p>
    </div>
  );
};

export default ValueProp;
