import { useRouter } from 'next/navigation';
import Image from "next/image";
import { usePostHog } from "posthog-js/react";

interface IntegrationButtonProps {
  text: string;
  integrationUrl: string;
  iconPath: string;
}

const IntegrationButton = ({text, integrationUrl, iconPath }: IntegrationButtonProps) => {
  const router = useRouter();
  const posthog = usePostHog();

  const handleClick = () => {
    posthog.capture("$click", {
      $event_type: "integration_click",
      $current_url: window.location.href,
    });
    router.push('/jira-integration'); // Navigate to the Jira integration page
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Integration Button"
      type="button"
      className={`bg-pink-600 hover:bg-pink-700 text-white rounded-xl transition-colors duration-200 text-md sm:text-lg xl:text-xl py-3 sm:py-2 md:py-4 px-8 shadow-xl hover:shadow-xl font-semibold md:w-auto mx-auto mt-6 sm:mt-2 md:mt-6 flex items-center gap-2`}
    >
      <Image
        src={iconPath}
        width={200}
        height={200}
        alt="Integration Logo"
        loading="lazy"
        className="invert"
      />
    </button>
  );
};

export default IntegrationButton;
