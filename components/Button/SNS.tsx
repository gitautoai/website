// Third party imports
import { faGithub, faXTwitter, faLinkedin, faYoutube } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { usePostHog } from "posthog-js/react";

// Local imports
import { ABSOLUTE_URLS } from "@/config";

const SNS = () => {
  const posthog = usePostHog();
  const iconSize = "xl";
  return (
    <div className="flex items-center gap-5">
      <Link
        href={ABSOLUTE_URLS.GITHUB.INSTALL_GITAUTO}
        target="_blank"
        onClick={() => {
          posthog.capture("$click", {
            $event_type: "github_app_install_footer",
            $current_url: window.location.href,
          });
        }}
      >
        <FontAwesomeIcon icon={faGithub} size={iconSize} />
      </Link>
      <Link
        href={ABSOLUTE_URLS.TWITTER}
        target="_blank"
        onClick={() => {
          posthog.capture("$click", {
            $event_type: "x_footer",
            $current_url: window.location.href,
          });
        }}
      >
        <FontAwesomeIcon icon={faXTwitter} size={iconSize} />
      </Link>
      <Link
        href={ABSOLUTE_URLS.YOUTUBE.HOME}
        target="_blank"
        onClick={() => {
          posthog.capture("$click", {
            $event_type: "youtube_footer",
            $current_url: window.location.href,
          });
        }}
      >
        <FontAwesomeIcon icon={faYoutube} size={iconSize} />
      </Link>
      <Link
        href={ABSOLUTE_URLS.LINKEDIN}
        target="_blank"
        onClick={() => {
          posthog.capture("$click", {
            $event_type: "linked_in_footer",
            $current_url: window.location.href,
          });
        }}
      >
        <FontAwesomeIcon icon={faLinkedin} size={iconSize} />
      </Link>
    </div>
  );
};

export default SNS;
