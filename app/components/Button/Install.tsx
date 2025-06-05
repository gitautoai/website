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
    <a
      href={ABSOLUTE_URLS.GITHUB.INSTALL_GITAUTO}
      target="_blank"
      onClick={() => {
        posthog.capture("$click", {
          $event_type: "github_app_install",
          $current_url: window.location.href,
        });
      }}
      className={`bg-pink-600 hover:bg-pink-700 text-white rounded-xl transition-colors duration-200 text-md sm:text-lg xl:text-xl py-3 sm:py-2 md:py-4 px-8 shadow-xl hover:shadow-xl font-semibold md:w-auto mx-auto mt-3 sm:mt-2 md:mt-6 flex items-center gap-2`}
    >
      <Image
        src="/icons/github.svg"
        width={30}
        height={30}
        alt="Github Logo"
        loading="lazy"
        className="invert"
      />
      {text}
    </a>
  );
};

export default InstallButton;
