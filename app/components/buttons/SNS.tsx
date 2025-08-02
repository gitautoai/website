// Third party imports
import {
  faGithub,
  faXTwitter,
  faLinkedin,
  faYoutube,
  faAtlassian,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { usePostHog } from "posthog-js/react";

// Local imports
import { ABSOLUTE_URLS } from "@/config/urls";

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
        <FontAwesomeIcon icon={faGithub} size={iconSize} className="" />
      </Link>
      <Link
        href={ABSOLUTE_URLS.ATLASSIAN.MARKETPLACE}
        target="_blank"
      >
        <FontAwesomeIcon icon={faAtlassian} size="lg" className="" />
      </Link>
      <Link
        href={ABSOLUTE_URLS.LINKEDIN}
        target="_blank"
      >
        <FontAwesomeIcon icon={faLinkedin} size={iconSize} className="" />
      </Link>
      <Link
        href={ABSOLUTE_URLS.TWITTER}
        target="_blank"
      >
        <FontAwesomeIcon icon={faXTwitter} size={iconSize} className="" />
      </Link>
      <Link
        href={ABSOLUTE_URLS.YOUTUBE.HOME}
        target="_blank"
      >
        <FontAwesomeIcon icon={faYoutube} size={iconSize} className="" />
      </Link>
    </div>
  );
};

export default SNS;
