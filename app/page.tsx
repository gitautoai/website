"use client";
import React, { useEffect } from "react";

// NextJs imports
import Image from "next/image";
import Link from "next/link";

// Components
import Footer from "@/components/Footer";
import Pricing from "@/components/HomePage/Pricing";

// Animation
import { motion } from "framer-motion";

// Analytics
import { usePathname } from "next/navigation";
import { usePostHog } from "posthog-js/react";

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function Home() {
  const personTypeButtonStyles = `bg-blue text-white rounded-lg transition-colors 
  duration-200 text-md footerSM:text-lg xl:text-xl py-5 px-8 shadow-lg hover:shadow-lg 
  cursor-pointer hover:bg-blueHover font-semibold text-center nav:w-auto`;

  const modalButtonStyles = `bg-blue text-white rounded-lg transition-colors duration-200 text-md footerSM:text-lg xl:text-xl
  py-5 px-8 shadow-md hover:shadow-lg cursor-pointer hover:bg-blueHover font-bold`;

  // Analytics
  const pathname = usePathname();
  const posthog = usePostHog();

  useEffect(() => {
    if (pathname && posthog) {
      let url = window.origin + pathname;
      posthog.capture("$pageview", {
        $current_url: url,
      });
    }
  }, [pathname, posthog]);

  // const stripe = useStripe();
  // const elements = useElements();
  // const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   const cardElement = elements?.getElement("card");

  //   try {
  //     if (!stripe || !cardElement) return null;
  //     const { data } = await axios.post("/api/create-payment-intent", {
  //       data: { amount: 89 },
  //     });
  //     const clientSecret = data;

  //     await stripe?.confirmCardPayment(clientSecret, {
  //       payment_method: { card: cardElement },
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  return (
    <div className="h-[calc(100vh-73px)] bg-darkBlue text-white">
      <div
        className="flex flex-col justify-center items-center bg-darkBlue  py-5 gap-8 footerSM:gap-10 footerSM:py-8 md:gap-12 lg:gap-16
         md:py-12 lg:py-16 mb-auto"
      >
        <div className="w-[98vw] ml:w-[95vw] lg:w-[90vw] xl:w-[80vw] xxl:w-[1280px] ">
          <div className="flex flex-col md:flex-row items-center justify-evenly gap-8 md:gap-6 lg:gap-8 xl:gap-10 mx-5">
            <div className="flex flex-col items-center gap-4 fourteenHundred:gap-6 text-center">
              <h1 className="text-center text-3xl footerSM:text-5xl fourteenHundred:text-7xl font-helvetica font-semibold">
                Automatic PR&apos;s<br></br>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue to-[#FCA831]">
                  for Bugs
                </span>
                🪲
              </h1>
              <Link
                href="https://github.com/apps/gitauto-ai"
                passHref
                target="_blank"
                onClick={() => {
                  posthog.capture("$click", {
                    $event_type: "github_app_install",
                    $current_url: window.location.href,
                  });
                }}
                className={`${personTypeButtonStyles} mx-auto mt-2 flex items-center gap-2`}
              >
                <Image
                  src="/github.svg"
                  width={30}
                  height={30}
                  alt="Github Logo"
                />
                Get Started
              </Link>
            </div>
            <div className="flex rounded-lg outline-none shadow-lg">
              <div
                className="block w-[300px] h-[169px] footerXM:w-[350px] footerXM:h-[197px] lgMenu:w-[400px] lgMenu:h-[225px] md:w-[300px] md:h-[169px]
             ml:w-[350px] ml:h-[197px] lg:w-[400px] lg:h-[225px] xl:w-[450px] xl:h-[253px] relative outline-none"
              >
                <video autoPlay loop muted>
                  <source src="/demo-v1.mp4" />
                </video>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white text-black w-[100vw] flex flex-col h-[300px]">
          <div className="w-[98vw] ml:w-[95vw] lg:w-[90vw] xl:w-[80vw] xxl:w-[1280px] flex flex-col items-center ">
            <div className="flex flex-col ">
              <h2 className="text-center mt-5 mb-2">
                Reduce cost by 99% by never hiring an engineer
              </h2>
              <span>&bull; Feature Requests</span>
              <span>&bull; Bug Fixes</span>
            </div>
          </div>
        </div>
        <Pricing />
        <div className="w-[98vw] ml:w-[95vw] lg:w-[90vw] xl:w-[80vw] xxl:w-[1280px] ">
          <div className="flex flex-col md:flex-row items-center justify-evenly gap-8 md:gap-6 lg:gap-8 xl:gap-10 mx-5">
            Frequently Asked Questions Do we collect your data? We save your
            chat history with an issue until that issue is closed out. No other
            data is collected or saved.
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

{
  /* <nav>Create Nav Bar</nav>
<h1>Fix Bugs Automatically</h1>
<h1>Fix Bugs Using AI</h1>
<h1>Automatic PRs for old bugs</h1>
<div>Create Footer</div> */
}
