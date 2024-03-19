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

import YouTube from "react-youtube";

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

  const opts = {
    height: "600",
    width: "1068",
    playerVars: {
      autoplay: 1,
      disablekb: 1,
    },
  };

  const opts2 = {
    height: "300",
    width: "480",
    playerVars: {
      autoplay: 1,
      disablekb: 1,
    },
  };

  const opts3 = {
    height: "214",
    width: "381",
    playerVars: {
      autoplay: 1,
      disablekb: 1,
    },
  };

  const opts4 = {
    height: "177",
    width: "315",
    playerVars: {
      autoplay: 1,
      disablekb: 1,
    },
  };

  const onReady = (event: any) => {
    event.target.mute();
  };

  return (
    <div className="h-[calc(100vh-73px)] bg-darkBlue text-white ">
      <div className="flex flex-col justify-center items-center bg-darkBlue">
        <div className="w-[98vw] ml:w-[95vw] lg:w-[90vw] xl:w-[80vw] xxl:w-[1280px] ">
          <div className="flex flex-col md:flex-row items-center justify-evenly gap-8 md:gap-6 lg:gap-8 xl:gap-10 mx-5">
            <div className="flex flex-col items-center gap-4 fourteenHundred:gap-6 text-center">
              <h1 className="text-center text-3xl footerSM:text-5xl fourteenHundred:text-7xl font-helvetica font-semibold mt-10">
                Create Code <br></br>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue to-[#FCA831]">
                  100x cheaper
                </span>
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
                  src="/icons/github.svg"
                  width={30}
                  height={30}
                  alt="Github Logo"
                />
                Get Started for Free
              </Link>
            </div>
          </div>
        </div>
        <div className="flexrounded-lg outline-none shadow-lg mt-10 mb-16">
          <YouTube
            className="hidden tw:block"
            videoId="VFBvO-ezMIs"
            opts={opts}
            onReady={onReady}
          />
          <YouTube
            className="hidden five:block tw:hidden outline-none"
            videoId="VFBvO-ezMIs"
            opts={opts2}
            onReady={onReady}
          />
          <YouTube
            className="hidden fourteen:block five:hidden outline-none"
            videoId="VFBvO-ezMIs"
            opts={opts3}
            onReady={onReady}
          />
          <YouTube
            className="block fourteen:hidden outline-none"
            videoId="VFBvO-ezMIs"
            opts={opts4}
            onReady={onReady}
          />
        </div>

        <div className="bg-white text-black w-[100vw] flex flex-col py-16">
          <div className="flex flex-col items-center">
            <h2 className="text-center text-3xl">
              Reduce cost by 99% by never hiring an engineer
            </h2>
            <div className="flex flex-col gap-5 mt-5">
              <div className="flex flex-col">
                <span>Feature Requests</span>
                <span>Ask GitAuto to create a feature</span>
              </div>
              <Image
                src="/homepage/error.png"
                width={300}
                height={300}
                alt="Feature Request"
              />
            </div>
            <div className="flex">
              <div className="flex flex-col">
                <span>Bug Fixes</span>
                <span>Ask GitAuto to fix bugs</span>
              </div>
              <Image
                src="/homepage/error.png"
                width={300}
                height={300}
                alt="Feature Request"
              />
            </div>
            <div className="flex">
              <div className="flex flex-col">
                <span>Code Debt</span>
                <span>Ask GitAuto to refactor and fix code</span>
              </div>
              <Image
                src="/homepage/error.png"
                width={300}
                height={300}
                alt="Feature Request"
              />
            </div>
          </div>
        </div>

        <div className="bg-light text-black w-[100vw] flex flex-col py-16">
          <div className="flex flex-col items-center">
            <h2 className="text-center text-3xl">Installation</h2>
            <div className=" flex flex-col gap-5 mt-5">
              <span>&bull; Install our Github App</span>
              <span>
                &bull; Select the repositories you would like to activate
              </span>
              <span>
                &bull; Create an issue such as a bug report or feature request.
              </span>
              <span>
                &bull; Click the checkbox in GitAuto&apos;s comment to Generate
                a PR
              </span>
              <span>
                &bull; Viola, your PR will soon be created. The progress is
                reflected in the comment
              </span>
            </div>
          </div>
        </div>

        <Pricing />

        <div className="bg-white text-black w-[100vw] flex flex-col items-center py-16 ">
          <h2 className="text-center text-3xl">
            <a id="faq"> Frequently Asked Questions</a>
          </h2>
          <div className=" flex flex-col gap-5 mt-5">
            <div className="flex flex-col ">
              <span className="font-bold text-lg">
                Do we collect your data?
              </span>
              <span className="text-md">
                We save your chat history with an issue until that issue is
                closed out. No other data is collected or saved.
              </span>
            </div>
            <div className="flex flex-col ">
              <span className="font-bold text-lg">
                What languages do we support?
              </span>
              <span className="text-md">
                GitAuto supports virtually all languages.
              </span>
            </div>
            <div className="flex flex-col ">
              <span className="font-bold text-lg">
                Is there a repository limit?
              </span>
              <span className="text-md">
                There is not. However user and organization repositories can not
                be used under the same account.
              </span>
            </div>
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
