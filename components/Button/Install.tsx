import Image from "next/image";
import { config } from "@/config";
import { usePostHog } from "posthog-js/react";

interface InstallButtonProps {
  text: string;
}

const InstallButton = ({ text }: InstallButtonProps) => {
  const posthog = usePostHog();
  return (
    <a
      href={config.NEXT_PUBLIC_GITHUB_APP_URL}
      target="_blank"
      onClick={() => {
        posthog.capture("$click", {
          $event_type: "github_app_install",
          $current_url: window.location.href,
        });
      }}
      className={`bg-pink-600 hover:bg-pink-700 text-white rounded-xl transition-colors duration-200 text-md sm:text-lg xl:text-xl py-3 md:py-4 px-8 shadow-xl hover:shadow-xl font-semibold md:w-auto mx-auto mt-6 flex items-center gap-2`}
    >
      <Image src="/icons/github.svg" width={30} height={30} alt="Github Logo" className="invert" />
      {text}
    </a>
  );
};

export default InstallButton;
