import Link from "next/link";
import { REL } from "@/config";
import { LINK_CLASS } from "@/styles/tailwind";

const convertToLinks = (text: string) => {
  const markdownLinkRegex = /\[([^\]]*)\]\((https?:\/\/[^\)]+|\/[^\)]*)\)/g;
  // const urlRegex = /(https?:\/\/[^\s]+)/g;
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const parts = [];
  let lastIndex = 0;

  // Combine regex for both links and emails
  const combinedRegex = new RegExp(`${markdownLinkRegex.source}|${emailRegex.source}`, "g");
  let match;

  while ((match = combinedRegex.exec(text)) !== null) {
    parts.push(text.slice(lastIndex, match.index));

    if (match[1] !== undefined && match[2] !== undefined) {
      const linkText = match[1];
      const url = match[2];

      if (url.startsWith("/")) {
        parts.push(
          <Link key={`link-${match.index}`} href={url} className={LINK_CLASS}>
            {linkText || url}
          </Link>
        );
      } else {
        parts.push(
          <a
            key={`link-${match.index}`}
            href={url}
            className={LINK_CLASS}
            target="_blank"
            rel={REL}
          >
            {linkText || url}
          </a>
        );
      }
    } else if (match[0].match(emailRegex)) {
      parts.push(
        <a key={`email-${match.index}`} href={`mailto:${match[0]}`} className={LINK_CLASS}>
          {match[0]}
        </a>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  parts.push(text.slice(lastIndex));
  return parts;
};

export default convertToLinks;
