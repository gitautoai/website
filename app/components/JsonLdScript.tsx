// Third-party imports
import Script from "next/script";
import { FC } from "react";

interface JsonLdScriptProps {
  data: object;
}

/**
 * Common JSON-LD structured data component
 */
const JsonLdScript: FC<JsonLdScriptProps> = ({ data }) => {
  return (
    <Script
      id="jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      strategy="beforeInteractive"
    />
  );
};

export default JsonLdScript;
