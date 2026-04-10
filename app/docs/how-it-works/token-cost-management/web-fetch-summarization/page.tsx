import { DocsContact } from "@/app/components/docs/DocsContact";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { getNavigation } from "@/app/docs/how-it-works/navigation";
import { RELATIVE_URLS } from "@/config/urls";

export default function WebFetchSummarizationPage() {
  const { prev, next } = getNavigation(
    RELATIVE_URLS.DOCS.HOW_IT_WORKS.TOKEN_COST_MANAGEMENT.WEB_FETCH_SUMMARIZATION,
  );
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Web Fetch Summarization</h1>

      <div className="space-y-12">
        <section>
          <p className="text-gray-600 mb-4">
            When the agent fetches a web page (documentation, API references, etc.), the raw HTML
            converts to 10K-50K+ tokens of markdown. Most of it is navigation, sidebars, and
            boilerplate. GitAuto uses Claude Haiku 4.5 as a summarization layer to extract only the
            relevant information before passing it to the main reasoning model.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why This Exists</h2>
          <p className="text-gray-600 mb-4">
            The main reasoning model (Claude Opus) costs $5/$25 per million input/output tokens.
            Claude Haiku costs $1/$5. Passing a 30K-token web page directly to Opus costs ~$0.15 in
            input tokens alone. Running it through Haiku first and returning a 1K-token summary
            costs ~$0.03 for Haiku input + ~$0.005 for Haiku output + ~$0.005 for Opus input on the
            summary. That&apos;s roughly an 80% cost reduction per web fetch.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <ol className="list-decimal pl-6 space-y-2 text-gray-600">
            <li>
              The agent calls <code>web_fetch</code> with a URL and a prompt describing what
              information to extract.
            </li>
            <li>
              GitAuto fetches the page, strips unnecessary HTML elements (nav, footer, ads,
              scripts), and converts the main content area to markdown.
            </li>
            <li>
              The markdown and the extraction prompt are sent to Claude Haiku, which returns a
              focused summary containing only the requested information.
            </li>
            <li>
              The summary (not the full markdown) is returned to the main model&apos;s conversation.
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Two Tools, Not One</h2>
          <p className="text-gray-600 mb-4">
            Not every URL needs summarization. JSON API responses, raw text files, and configuration
            files should be returned as-is. GitAuto provides two tools:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>
              <code>web_fetch</code> - Fetches HTML pages, converts to markdown, summarizes with
              Haiku. For documentation, articles, and web content.
            </li>
            <li>
              <code>curl</code> - Fetches raw content with no processing. For JSON APIs, text files,
              and anything where exact content matters.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why the Model Cannot Solve This</h2>
          <p className="text-gray-600 mb-4">
            The main model is smart enough to ignore irrelevant content on a web page. But by the
            time it sees the content, you have already paid for the input tokens. Asking the model
            to &quot;focus on the relevant parts&quot; does not reduce the cost - the full page is
            already in the context window. The filtering must happen before the tokens reach the
            expensive model, which is an application-layer decision, not a model capability.
          </p>
        </section>
      </div>

      <DocsNavigation previousLink={prev} nextLink={next} />
      <DocsContact />
    </>
  );
}
