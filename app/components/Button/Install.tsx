"use client";
import { ABSOLUTE_URLS } from "@/config";
import Image from "next/image";
import { usePostHog } from "posthog-js/react";

interface InstallButtonProps {
  text: string;
}

const InstallButton = ({ text }: InstallButtonProps) => {
  const posthog = usePostHog();
  return (
    <div className="relative group w-fit mx-auto mt-3 sm:mt-2 md:mt-6">
      <a
        href={ABSOLUTE_URLS.GITHUB.INSTALL_GITAUTO}
        target="_blank"
        onClick={() => {
          posthog.capture("$click", {
            $event_type: "github_app_install",
            $current_url: window.location.href,
          });
        }}
        className="relative bg-pink-600 text-white rounded-xl transition-all duration-200
          text-md sm:text-lg xl:text-xl py-3 sm:py-2 md:py-4 px-8 shadow-md font-semibold md:w-auto flex items-center gap-2
          hover:scale-105 focus:scale-105 hover:shadow-lg hover:shadow-pink-500/50"
      >
        <Image
          src="/icons/github.svg"
          width={30}
          height={30}
          alt="Github Logo"
          loading="lazy"
          className="invert transition-transform duration-200 group-hover:rotate-[-12deg] group-hover:scale-110"
        />
        {text}
      </a>
    </div>
  );
};

export default InstallButton;
