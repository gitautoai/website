import { config, PRODUCT_NAME, RELATIVE_URLS, URLS } from "@/config";
import Link from "next/link";

export default function HowToGetStarted() {
  return (
    <div id="how-to-get-started" className="h-screen flex flex-col items-center justify-center">
      <div className="flex flex-col items-center space-y-12 md:space-y-20">
        <h2 className="text-center text-3xl md:text-4xl">How to get started</h2>
        <ul className="list-decimal list-outside space-y-1 md:space-y-4 ml-5">
          <li className="font-semibold">
            Install {PRODUCT_NAME} from{" "}
            <a
              href={config.NEXT_PUBLIC_GITHUB_APP_URL}
              target="_blank"
              // onClick={() => {
              //   posthog.capture("$click", {
              //     $event_type: "github_app_install",
              //     $current_url: window.location.href,
              //   });
              // }}
              className="text-pink-500 visited:text-pink-700 underline"
            >
              Github Marketplace
            </a>
            .
          </li>
          <ul className="list-disc list-outside pl-4 md:pl-11 space-y-0 md:space-y-1">
            <li>
              If you see “Settings” tab in your repository, you are likely your organization owner
              or the repository admin, and you can install {PRODUCT_NAME}.
            </li>
            <li className="hidden md:list-item">
              If you don&apos;t, you can still request the installation.
            </li>
            <li className="hidden md:list-item">
              Manage roles in the repository under “Settings” &gt; “Collaborators and teams”.
            </li>
          </ul>
          <li className="font-semibold">
            Select the repositories you would like to use. You can change this anytime later{" "}
            <a
              href={URLS.GITHUB.INSTALLED_APPS}
              target="_blank"
              className="text-pink-500 visited:text-pink-700 underline"
            >
              here
            </a>
            .
          </li>
          <ul className="list-disc list-outside pl-4 md:pl-11 space-y-0 md:space-y-1">
            <li>
              A pull request with our issue templates will be created in the installed repositories.
            </li>
            <li className="hidden md:list-item">
              It is recommended to install {PRODUCT_NAME} only on active repositories. While{" "}
              {PRODUCT_NAME} works autonomously in the installed repositories, there is a limit to
              the number of activities.
            </li>
          </ul>
          <li className="font-semibold">
            The default plan is free, no payment method is required. Subscribe to a paid plan to
            increase usage limits.
          </li>
          <li className="font-semibold">
            Now you&apos;re all set! Go to{" "}
            <Link href={RELATIVE_URLS.HOW_IT_WORKS} className="text-pink-500 visited:text-pink-700 underline">
              “How it works”
            </Link>{" "}
            section for further instructions.
          </li>
        </ul>
      </div>
    </div>
  );
}
