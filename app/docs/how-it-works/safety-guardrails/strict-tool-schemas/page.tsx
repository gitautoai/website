import Link from "next/link";
import { DocsContact } from "@/app/components/docs/DocsContact";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { getNavigation } from "@/app/docs/how-it-works/navigation";
import { RELATIVE_URLS } from "@/config/urls";

export default function StrictToolSchemasPage() {
  const { prev, next } = getNavigation(
    RELATIVE_URLS.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS.STRICT_TOOL_SCHEMAS,
  );
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Strict Tool Schemas</h1>

      <div className="space-y-12">
        <section>
          <p className="text-gray-600 mb-4">
            All tool definitions in GitAuto use{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">{'"strict": true'}</code> in
            their JSON schemas with{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">
              {'"additionalProperties": false'}
            </code>
            . This forces the model to produce valid JSON matching the exact schema, with no extra
            fields or wrong types.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why This Exists</h2>
          <p className="text-gray-600 mb-4">
            Without strict schemas, the model can hallucinate extra fields, use wrong types, or pass
            malformed arguments to tools. For example, it might add a{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">confidence</code> field that
            does not exist in the schema, or pass a number where a string is expected. Strict mode
            catches these errors at the API level before any tool execution occurs.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why Models Hallucinate Tool Parameters</h2>
          <p className="text-gray-600 mb-4">
            Models generate tool call parameters by token prediction, not by schema validation. If a
            tool expects{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">file_path</code>, the model
            might output <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">filepath</code>
            , <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">path</code>, or{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">file_name</code> - all
            semantically equivalent but technically wrong. Models also add extra fields or use wrong
            types (string instead of integer) because training data contains diverse JSON structures
            with varying field names for the same concept. Without strict validation, these small
            deviations silently break tool execution.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <p className="text-gray-600 mb-4">
            Every tool definition sent to the LLM API includes{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">{'"strict": true'}</code> at
            the top level and{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">
              {'"additionalProperties": false'}
            </code>{" "}
            in the JSON schema. The API validates the model&apos;s tool call output against the
            schema before returning it. If the output does not match - wrong types, extra fields,
            missing required fields - the API returns a validation error instead of the malformed
            tool call. GitAuto&apos;s tool argument correction feature can then fix minor issues and
            retry.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Related Features</h2>
          <ul className="list-disc pl-8 text-gray-600 space-y-2">
            <li>
              <Link
                href={
                  RELATIVE_URLS.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION.TOOL_ARGUMENT_CORRECTION
                }
                className="text-pink-600 hover:underline"
              >
                Tool Argument Correction
              </Link>{" "}
              - fixes minor argument issues that strict schemas catch
            </li>
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS.TEMPERATURE_ZERO}
                className="text-pink-600 hover:underline"
              >
                Temperature Zero
              </Link>{" "}
              - reduces randomness that could lead to schema violations
            </li>
          </ul>
        </section>
      </div>

      <DocsContact />

      <DocsNavigation
        previousLink={prev ? { href: prev.href, title: prev.title } : undefined}
        nextLink={next ? { href: next.href, title: next.title } : undefined}
      />
    </>
  );
}
