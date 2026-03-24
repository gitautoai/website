import Link from "next/link";
import { DocsContact } from "@/app/components/docs/DocsContact";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { getNavigation } from "@/app/docs/how-it-works/navigation";
import { RELATIVE_URLS } from "@/config/urls";

export default function ReviewResponseGuardrailsPage() {
  const { prev, next } = getNavigation(
    RELATIVE_URLS.DOCS.HOW_IT_WORKS.HALLUCINATION_PREVENTION.REVIEW_RESPONSE_GUARDRAILS,
  );
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Review Response Guardrails</h1>

      <div className="space-y-12">
        <section>
          <p className="text-gray-600 mb-4">
            The review trigger prompt includes instructions that tell the model: &quot;Do NOT
            blindly follow the reviewer&apos;s suggestion,&quot; &quot;Think critically about
            whether the suggestion makes sense,&quot; &quot;No flattery or praise in
            responses,&quot; and &quot;Update GITAUTO.md for reusable rules.&quot;
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why This Exists</h2>
          <p className="text-gray-600 mb-4">
            Without guardrails, the model sycophantically agrees with every review comment, even
            when the reviewer is wrong. It responds with &quot;Great suggestion!&quot; and
            implements a change that breaks the code. A reviewer might suggest removing error
            handling (&quot;this try-catch seems unnecessary&quot;), and the model would eagerly
            comply, introducing an unhandled exception. Sycophancy is one of the model&apos;s
            strongest failure modes, and review responses are where it causes the most damage.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why Models Are Sycophantic</h2>
          <p className="text-gray-600 mb-4">
            This is fundamentally a training problem. Models are trained with reinforcement learning
            from human feedback (RLHF), where human raters consistently reward agreeable,
            helpful-sounding responses. This training signal is so strong that models will agree to
            changes they &quot;know&quot; will break code. When a reviewer says &quot;change X to
            Y,&quot; the model&apos;s default is to comply because compliance gets positive
            reinforcement in training. Pushing back - saying &quot;actually, that would break
            Z&quot; - requires the model to contradict the human, which RLHF actively penalizes. The
            result is models that are dangerously agreeable when review suggestions are technically
            wrong.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <p className="text-gray-600 mb-4">
            When a review comment triggers a new agent session, the system prompt includes specific
            anti-sycophancy instructions. The model is told to evaluate whether the suggestion is
            technically correct before implementing it. If the suggestion would break functionality,
            the model is instructed to explain why and propose an alternative. Flattery (e.g.,
            &quot;Great catch!&quot;) is explicitly prohibited to keep responses focused on
            technical substance. Additionally, if the review reveals a reusable pattern or rule, the
            model is instructed to add it to GITAUTO.md so future sessions benefit.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Related Features</h2>
          <ul className="list-disc pl-8 text-gray-600 space-y-2">
            <li>
              <Link
                href={
                  RELATIVE_URLS.DOCS.HOW_IT_WORKS.HALLUCINATION_PREVENTION.GITAUTO_MD_RESTRICTIONS
                }
                className="text-pink-600 hover:underline"
              >
                GITAUTO.md Restrictions
              </Link>{" "}
              - controls what gets saved to GITAUTO.md from review learnings
            </li>
            <li>
              <Link
                href={
                  RELATIVE_URLS.DOCS.HOW_IT_WORKS.HALLUCINATION_PREVENTION
                    .ANTI_HALLUCINATION_PROMPTS
                }
                className="text-pink-600 hover:underline"
              >
                Anti-Hallucination Prompts
              </Link>{" "}
              - similar prompt-based approach for preventing other hallucination types
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
