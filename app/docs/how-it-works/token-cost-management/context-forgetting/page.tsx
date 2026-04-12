import { DocsContact } from "@/app/components/docs/DocsContact";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { getNavigation } from "@/app/docs/how-it-works/navigation";
import { RELATIVE_URLS } from "@/config/urls";

export default function ContextForgettingPage() {
  const { prev, next } = getNavigation(
    RELATIVE_URLS.DOCS.HOW_IT_WORKS.TOKEN_COST_MANAGEMENT.CONTEXT_FORGETTING,
  );
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Context Forgetting</h1>

      <div className="space-y-12">
        <section>
          <p className="text-gray-600 mb-4">
            When an AI agent runs a multi-step coding task, it reads reference files early to learn
            patterns: test naming conventions, project structure, framework idioms. These files
            enter the conversation context and stay there for every subsequent API call. Input
            tokens account for roughly 95% of our Claude costs, so accumulated stale content is the
            highest-leverage target for optimization.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why the Agent Decides</h2>
          <p className="text-gray-600 mb-4">
            Most agent frameworks manage context from the outside: the orchestrator truncates,
            summarizes, or compacts the conversation. But coding agents read specific files for
            specific reasons. The orchestrator cannot know when the agent is &quot;done&quot; with a
            file. Only the agent knows.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <ol className="list-decimal pl-6 space-y-2 text-gray-600">
            <li>
              The agent reads reference files (existing tests, config files, etc.) to learn
              patterns.
            </li>
            <li>
              Once the agent has extracted the patterns it needs, it calls{" "}
              <code>forget_messages</code> with the list of file paths to forget.
            </li>
            <li>
              GitAuto replaces the file contents in the conversation history with a short
              placeholder like{" "}
              <code>
                [&apos;src/ref.py&apos; content removed because agent already extracted needed
                patterns]
              </code>
              .
            </li>
            <li>
              The placeholder reminds the agent the file existed. If it needs the file again later,
              it can re-read it.
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Token Economics</h2>
          <p className="text-gray-600 mb-4">
            If the agent forgets 15,000 characters of reference files on turn 5 of a 50-turn run:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>
              <strong>Cost of forgetting:</strong> near zero (one tool call, a few placeholder
              tokens)
            </li>
            <li>
              <strong>Savings per subsequent turn:</strong> 15,000 fewer input characters
            </li>
            <li>
              <strong>Total savings:</strong> 15,000 x 45 remaining turns = 675,000 fewer characters
              of input
            </li>
          </ul>
          <p className="text-gray-600 mt-4">
            The breakeven is immediate. The only risk is forgetting too early, but the agent can
            always re-read the file.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Monitoring</h2>
          <p className="text-gray-600 mb-4">
            Each <code>forget_messages</code> call logs the characters saved so the team can monitor
            usage patterns and verify the agent is making good decisions about what to forget and
            when.
          </p>
        </section>
      </div>

      <DocsNavigation previousLink={prev} nextLink={next} />
      <DocsContact />
    </>
  );
}
