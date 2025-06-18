// Third-party imports
import { FC } from "react";

interface JsonLdScriptProps {
  data: object;
}

/**
 * Common JSON-LD structured data component
 */
const JsonLdScript: FC<JsonLdScriptProps> = ({ data }) => {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
};

export default JsonLdScript;
