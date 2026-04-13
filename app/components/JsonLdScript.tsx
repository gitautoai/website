import { FC } from "react";

interface JsonLdScriptProps {
  data: object;
  id?: string;
}

/**
 * Common JSON-LD structured data component.
 * Uses a plain <script> tag because type="application/ld+json" is not executable JS —
 * it's purely data for search engines, so next/script is unnecessary.
 */
const JsonLdScript: FC<JsonLdScriptProps> = ({ data, id = "jsonld" }) => {
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
};

export default JsonLdScript;
