import { DocsContact } from "@/app/components/docs/DocsContact";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { getNavigation } from "@/app/docs/how-it-works/navigation";
import { RELATIVE_URLS } from "@/config/urls";

export default function FileQueryRoutingPage() {
  const { prev, next } = getNavigation(
    RELATIVE_URLS.DOCS.HOW_IT_WORKS.TOKEN_COST_MANAGEMENT.FILE_QUERY_ROUTING,
  );
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">File Query Routing</h1>

      <div className="space-y-12">
        <section>
          <p className="text-gray-600 mb-4">
            When the agent needs to learn something about a file (test framework, naming
            conventions, project structure), loading the full file into the main model&apos;s
            context is wasteful. The agent only needs the answer, not the source code. GitAuto
            routes these queries through Claude Haiku so only the answer enters the expensive
            model&apos;s context.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <ol className="list-decimal pl-6 space-y-2 text-gray-600">
            <li>
              The agent provides a file path and a question (e.g., &quot;What test framework and
              fixtures are used?&quot;).
            </li>
            <li>GitAuto reads the file from the local clone and formats it with line numbers.</li>
            <li>
              The file content and question are sent to Claude Haiku ($1 per million input tokens),
              which returns a focused answer.
            </li>
            <li>
              Only the answer (typically a few hundred characters) enters the main model&apos;s
              conversation, not the full file (often 10,000+ characters).
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Same Pattern as Web Fetch</h2>
          <p className="text-gray-600 mb-4">
            This follows the same architecture as URL fetching, which routes web pages through Haiku
            before passing summaries to the main model. The difference is the data source: local
            files instead of URLs.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Three Modes of File Access</h2>
          <p className="text-gray-600 mb-4">
            The agent picks the cheapest way to interact with a file:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>
              <strong>Full read</strong> &mdash; loads the entire file into context. For when the
              agent needs exact code to edit.
            </li>
            <li>
              <strong>Query</strong> &mdash; routes through Haiku, returns only the answer. For when
              the agent needs to learn something about the file.
            </li>
            <li>
              <strong>Forget</strong> &mdash; drops file content already in context. For when a full
              read happened but the content is no longer needed.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Cost Impact</h2>
          <p className="text-gray-600 mb-4">
            A 15,000-character file queried through Haiku costs roughly $0.004 in Haiku input tokens
            plus a small amount for the answer. Loading the same file directly into Opus context
            costs more per turn, and the cost compounds across every subsequent API call in the
            conversation. Input tokens account for roughly 95% of our Claude costs, making this the
            highest-leverage optimization target.
          </p>
        </section>
      </div>

      <DocsNavigation previousLink={prev} nextLink={next} />
      <DocsContact />
    </>
  );
}
