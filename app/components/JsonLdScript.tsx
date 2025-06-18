// Third-party imports
import Script from "next/script";
import { FC } from "react";

interface JsonLdScriptProps {
  data: object;
  id?: string;
}

/**
 * Common JSON-LD structured data component
 */
const JsonLdScript: FC<JsonLdScriptProps> = ({ data, id = "jsonld" }) => {
  return (
    <Script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      strategy="beforeInteractive"
    />
  );
};

export default JsonLdScript;
