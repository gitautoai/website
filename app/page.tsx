"use client";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "@/components/CheckoutForm";
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

import Script from "next/script";
import Footer from "@/components/Footer";
import Link from "next/link";

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

  const pricingButtonStyles = `my-8 rounded-lg transition-colors  duration-200 
  text-md footerSM:text-lg xl:text-xl py-3 px-8 mx-auto shadow-lg hover:shadow-lg 
  cursor-pointer hover:bg-blueHover font-semibold text-center nav:w-auto`;

  const modalButtonStyles = `bg-blue text-white rounded-lg transition-colors duration-200 text-md footerSM:text-lg xl:text-xl
  py-5 px-8 shadow-md hover:shadow-lg cursor-pointer hover:bg-blueHover font-bold`;

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
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue to-blueHover">
                  for Bugs
                </span>
                🪲
              </h1>
              <Link
                href="https://github.com/apps/gitauto-ai"
                passHref
                target="_blank"
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
            <div className="flex p-1 pb-3 bg-gray rounded-lg outline-none shadow-lg">
              <div
                className="block w-[300px] h-[169px] footerXM:w-[350px] footerXM:h-[197px] lgMenu:w-[400px] lgMenu:h-[225px] md:w-[300px] md:h-[169px]
             ml:w-[350px] ml:h-[197px] lg:w-[400px] lg:h-[225px] xl:w-[450px] xl:h-[253px] relative p-2  outline-none"
              >
                <video autoPlay loop muted>
                  <source src="/demo-1920x1080.mp4" />
                </video>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white text-black w-[100vw] flex flex-col">
          <div className="w-[98vw] ml:w-[95vw] lg:w-[90vw] xl:w-[80vw] xxl:w-[1280px]  ">
            <div className="flex flex-col md:flex-row items-center justify-evenly gap-8 md:gap-6 lg:gap-8 xl:gap-10 mx-5">
              Features Bug Fixes Automatic PRs AI
            </div>
          </div>
        </div>
        <div className="w-[98vw] ml:w-[95vw] lg:w-[90vw] xl:w-[80vw] xxl:w-[1280px] ">
          <div className="flex flex-col items-center justify-evenly gap-8">
            <h2 className="text-5xl" id="pricing">
              Pricing
            </h2>
            <div className="flex">
              <div className="flex flex-col p-5 mb-10">
                <h3 className="text-5xl">Free</h3>
                <span className="mt-2 text-xl">Starter</span>
                <Link
                  href="https://github.com/apps/gitauto-ai"
                  passHref
                  target="_blank"
                  className={`${pricingButtonStyles} bg-blue text-white flex items-center gap-2`}
                >
                  <Image
                    src="/github.svg"
                    width={30}
                    height={30}
                    alt="Github Logo"
                  />
                  Install
                </Link>
                <div className="flex flex-col">
                  <span>&bull; 2 issues per month</span>
                  <span>&bull; Solve bugs and implement features</span>
                  <span>&bull; Chat with issue and PR to modify PR</span>
                  <span>&bull; Support</span>
                </div>
              </div>
              <div className="flex flex-col rounded-xl bg-blue p-5 mb-5">
                <h3 className="text-5xl">$19</h3>
                <span className="mt-2 text-xl">Individual</span>
                <Link
                  href="https://buy.stripe.com/4gw15W4HNaBccWkcMM"
                  passHref
                  // onClick={onSubmit}

                  className={`${pricingButtonStyles} bg-darkBlue hover:bg-darkBlueHover text-white   flex items-center gap-2`}
                >
                  Purchase
                </Link>

                <div className="flex flex-col">
                  <span>&bull; 20 issues per month</span>
                  <span>&bull; Solve bugs and implement features</span>
                  <span>&bull; Chat with issue and PR to modify PR</span>
                  <span>&bull; Support</span>
                </div>
              </div>
              <div className="flex flex-col p-5 mb-10">
                <h3 className="text-5xl">Custom</h3>
                <span className="mt-2 text-xl">Enterprise</span>
                <Link
                  href="mailto:info@gitauto.ai"
                  passHref
                  target="_blank"
                  className={`${pricingButtonStyles} bg-blue text-white mx-auto  flex items-center gap-2`}
                >
                  Contact Us
                </Link>
                <div className="flex flex-col">
                  <span>&bull; 20+ issues/month per user</span>
                  <span>&bull; Solve bugs and implement features</span>
                  <span>&bull; Chat with issue and PR to modify PR</span>
                  <span>&bull; Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-[98vw] ml:w-[95vw] lg:w-[90vw] xl:w-[80vw] xxl:w-[1280px] ">
          <div className="flex flex-col md:flex-row items-center justify-evenly gap-8 md:gap-6 lg:gap-8 xl:gap-10 mx-5">
            Frequently Asked Questions Do we collect your data? Not at all.
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
