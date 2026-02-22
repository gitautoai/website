import Link from "next/link";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { CodeBlock } from "@/app/docs/coverage/CodeBlock";
import { STRUCTURED_RULES_CONFIG } from "@/app/settings/rules/config/structured-rules";
import { RELATIVE_URLS } from "@/config/urls";
import { bestPracticesFirst } from "./code/best-practices-first";
import { consistencyFirst } from "./code/consistency-first";
import { customRulesExample } from "./code/custom-rules";
import { oneFunctionPerFileGood } from "./code/one-function-per-file-good";
import { oneFunctionPerFileBad } from "./code/one-function-per-file-bad";
import { earlyReturnsGood } from "./code/early-returns-good";
import { earlyReturnsBad } from "./code/early-returns-bad";
import { commentsDisabled } from "./code/comments-disabled";
import { commentsEnabled } from "./code/comments-enabled";
import { testFileStructureGood } from "./code/test-file-structure-good";
import { testFileStructureSeparate } from "./code/test-file-structure-separate";
import { testNamingConventions } from "./code/test-naming-conventions";
import { testConstantsAuto } from "./code/test-constants-auto";
import { testConstantsCentralized } from "./code/test-constants-centralized";
import { functionStyleTest } from "./code/function-style-test";
import { classStyleTest } from "./code/class-style-test";
import { comprehensiveCoverage } from "./code/comprehensive-coverage";
import { refactoringBefore } from "./code/refactoring-before";
import { refactoringAfter } from "./code/refactoring-after";
import { functionComponentTest } from "./code/function-component-test";
import { isolatedComponentTest } from "./code/isolated-component-test";
import { DocsContact } from "@/app/components/docs/DocsContact";

export default function RulesPage() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Repository Rules Configuration</h1>

      <div className="prose prose-lg max-w-none space-y-12">
        <section id="what-are-repository-rules">
          <h2 className="text-3xl font-semibold mt-0 mb-6">What are Repository Rules?</h2>
          <p className="text-gray-700 mb-4">
            <Link
              href={RELATIVE_URLS.SETTINGS.RULES}
              className="text-pink-600 hover:text-pink-700 underline"
            >
              Repository rules
            </Link>{" "}
            are loaded every time GitAuto starts working on your repository. They control how tests
            are generated, ensuring consistent code quality across all your projects.
          </p>
          <p className="text-gray-700">
            The rules page has many options, but this guide explains what each one actually does,
            why the defaults are recommended, and how to use them effectively.
          </p>
        </section>

        <section id="repository-rule-categories">
          <h2 className="text-3xl font-semibold mt-0 mb-6">Repository Rule Categories</h2>
          <p className="text-gray-700 mb-6">Jump to any section that interests you:</p>

          <ul className="space-y-2 mb-8">
            {Object.entries(STRUCTURED_RULES_CONFIG).map(([sectionKey, section]) => (
              <li key={sectionKey}>
                <a href={`#${sectionKey}`} className="text-pink-600 hover:text-pink-700 underline">
                  {section.title}
                </a>
                <span className="text-gray-600 text-sm ml-2">- {section.description}</span>
              </li>
            ))}
            <li>
              <a href="#custom-rules" className="text-pink-600 hover:text-pink-700 underline">
                Custom Repository Rules
              </a>
              <span className="text-gray-600 text-sm ml-2">- Free-form rules</span>
            </li>
          </ul>
        </section>

        {/* Coding Rules */}
        <section id="codingRules">
          <h2 className="text-3xl font-semibold mt-0 mb-8">Coding Rules</h2>

          <div className="space-y-12">
            <div>
              <h3 className="text-2xl font-semibold mb-4">One Function Per File</h3>
              <p className="text-gray-700 mb-4">
                Each file contains exactly one main function. This makes tests easier to write since
                each test file focuses on testing just one thing.
              </p>

              <CodeBlock
                code={oneFunctionPerFileGood}
                language="typescript"
                filename="✓ Recommended approach"
              />

              <div className="mb-4" />

              <CodeBlock
                code={oneFunctionPerFileBad}
                language="typescript"
                filename="✗ What to avoid"
              />
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-4">Early Returns vs Deep Nesting</h3>
              <p className="text-gray-700 mb-4">
                Use early returns instead of deeply nested if statements. Handle error cases
                upfront, then focus on the main logic.
              </p>

              <CodeBlock
                code={earlyReturnsGood}
                language="typescript"
                filename="✓ Early returns (recommended)"
              />

              <div className="mb-4" />

              <CodeBlock
                code={earlyReturnsBad}
                language="typescript"
                filename="✗ Deep nesting (harder to read)"
              />
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-4">Code Pattern Strategy</h3>
              <p className="text-gray-700 mb-4">
                &quot;Best practices first&quot; gradually improves your codebase while respecting
                existing patterns. &quot;Consistency first&quot; always matches your current style.
              </p>

              <CodeBlock
                code={bestPracticesFirst}
                language="typescript"
                filename="✓ Best practices first (default)"
              />

              <div className="mb-4" />

              <CodeBlock
                code={consistencyFirst}
                language="typescript"
                filename="○ Consistency first"
              />
            </div>
          </div>
        </section>

        {/* Comment Rules */}
        <section id="commentRules">
          <h2 className="text-3xl font-semibold mt-0 mb-8">Comment Rules</h2>
          <div className="space-y-12">
            <div>
              <h3 className="text-2xl font-semibold mb-4">Comments in Generated Code</h3>
              <p className="text-gray-700 mb-4">
                Comments are disabled by default. Clean code should be self-explanatory. Enable only
                for complex algorithms that need explanation.
              </p>

              <CodeBlock
                code={commentsDisabled}
                language="typescript"
                filename="✓ Without comments (default)"
              />

              <div className="mb-4" />

              <CodeBlock
                code={commentsEnabled}
                language="typescript"
                filename="○ With comments enabled"
              />
            </div>
          </div>
        </section>

        {/* Test File Location and Naming */}
        <section id="testFileLocationAndNaming">
          <h2 className="text-3xl font-semibold mt-0 mb-6">Test File Location and Naming</h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold mb-4">Test File Placement</h3>
              <p className="text-gray-700 mb-4">
                Test files are placed next to source files by default. This makes it immediately
                obvious what&apos;s tested and what isn&apos;t.
              </p>

              <CodeBlock
                code={testFileStructureGood}
                language="text"
                filename="✓ Next to source files (default)"
              />

              <div className="mb-4" />

              <CodeBlock
                code={testFileStructureSeparate}
                language="text"
                filename="○ Alternative (separate directory)"
              />
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-4">Test Naming Conventions</h3>
              <p className="text-gray-700 mb-4">
                Choose a specific naming convention rather than auto-detect for consistency and
                stability. Auto-detection can be unpredictable when your project has mixed patterns.
              </p>

              <CodeBlock
                code={testNamingConventions}
                language="bash"
                filename="Language-specific conventions"
              />
            </div>
          </div>
        </section>

        {/* Test Constants Rules */}
        <section id="testConstantsRules">
          <h2 className="text-3xl font-semibold mt-0 mb-6">Test Constants Rules</h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold mb-4">Test Constants Management</h3>
              <p className="text-gray-700 mb-4">
                Use centralized constants when you have many shared test objects across multiple
                files.
              </p>

              <CodeBlock
                code={testConstantsAuto}
                language="typescript"
                filename="Auto-detection example"
              />

              <div className="mb-4" />

              <CodeBlock
                code={testConstantsCentralized}
                language="typescript"
                filename="Centralized constants option"
              />
            </div>
          </div>
        </section>

        {/* Unit Test Rules */}
        <section id="unitTestRules">
          <h2 className="text-3xl font-semibold mt-0 mb-6">Unit Test Rules</h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold mb-4">Function Style vs Class Style</h3>
              <p className="text-gray-700 mb-4">
                Function style is preferred because functional patterns are easier to test and
                reason about.
              </p>

              <CodeBlock
                code={functionStyleTest}
                language="typescript"
                filename="✓ Function style (recommended)"
              />

              <div className="mb-4" />

              <CodeBlock code={classStyleTest} language="typescript" filename="○ Class style" />
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-4">Comprehensive Test Coverage</h3>
              <p className="text-gray-700 mb-4">
                Tests edge cases and error conditions where most bugs hide, preventing production
                issues.
              </p>

              <CodeBlock
                code={comprehensiveCoverage}
                language="typescript"
                filename="✓ Comprehensive coverage"
              />
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-4">Allow Source Code Refactoring</h3>
              <p className="text-gray-700 mb-4">
                Sometimes source code structure makes it difficult to write clean tests. Small
                refactoring improves both code and test quality.
              </p>

              <CodeBlock
                code={refactoringBefore}
                language="typescript"
                filename="Before refactoring (hard to test)"
              />

              <div className="mb-4" />

              <CodeBlock
                code={refactoringAfter}
                language="typescript"
                filename="After refactoring (easy to test)"
              />
            </div>
          </div>
        </section>

        {/* Component Test Rules */}
        <section id="componentTestRules">
          <h2 className="text-3xl font-semibold mt-0 mb-6">Component Test Rules</h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold mb-4">Function vs Class Components</h3>
              <p className="text-gray-700 mb-4">
                Function components with hooks are simpler and easier to test than class components.
              </p>

              <CodeBlock
                code={functionComponentTest}
                language="typescript"
                filename="✓ Function component test"
              />
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-4">Component Isolation</h3>
              <p className="text-gray-700 mb-4">
                Unit tests should test one component at a time. Mocking dependencies ensures
                failures point to the specific component being tested.
              </p>

              <CodeBlock
                code={isolatedComponentTest}
                language="typescript"
                filename="✓ Isolated component test"
              />
            </div>
          </div>
        </section>

        {/* Custom Repository Rules */}
        <section id="custom-rules">
          <h2 className="text-3xl font-semibold mt-0 mb-6">Custom Repository Rules</h2>
          <p className="text-gray-700 mb-4">
            The free-form rules section is where you add project-specific requirements that
            aren&apos;t covered by the structured options. This is often the most important part of
            your configuration.
          </p>

          <CodeBlock code={customRulesExample} language="text" filename="Example custom rules" />
        </section>

        {/* How Repository Rules Are Applied */}
        <section id="how-repository-rules-are-applied">
          <h2 className="text-3xl font-semibold mt-0 mb-6">How Repository Rules Are Applied</h2>
          <p className="text-gray-700 mb-6">
            Rules are loaded fresh every time GitAuto starts working on your repository. This means
            changes take effect immediately for new test generation tasks.
          </p>
        </section>

        {/* Getting Started */}
        <section>
          <h2 className="text-3xl font-semibold mt-0 mb-6">Getting Started</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3">1. Start with Defaults</h3>
              <p className="text-gray-700">
                The default settings work well for most projects. Go to your{" "}
                <Link
                  href={RELATIVE_URLS.SETTINGS.RULES}
                  className="text-pink-600 hover:text-pink-700 underline"
                >
                  Rules Settings
                </Link>{" "}
                and see what&apos;s already configured.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">2. Add Project Context</h3>
              <p className="text-gray-700">
                Use the free-form section to explain your project setup, tech stack, and any
                specific requirements. This helps GitAuto understand your codebase better.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">3. Test and Refine</h3>
              <p className="text-gray-700">
                Create a test PR to see how GitAuto applies your rules. Adjust the configuration
                based on the results. Rules are meant to be iterative - you&apos;ll refine them as
                you learn what works best for your project.
              </p>
            </div>
          </div>
        </section>

        <DocsContact
          title="Need Help?"
          description="Want a rule that doesn't exist? Use the free-form section to write exactly what you need. GitAuto is flexible and can follow detailed instructions. Have questions about configuration? We're here to help you get the most out of GitAuto's rules system."
          callToAction="Contact us"
          linkText="with your questions or suggestions for new structured rules."
        />
      </div>

      <DocsNavigation
        previousLink={{
          href: RELATIVE_URLS.DOCS.GETTING_STARTED.INSTALLATION,
          title: "Installation",
        }}
        nextLink={{
          href: RELATIVE_URLS.DOCS.INTEGRATIONS.CIRCLECI,
          title: "CircleCI Integration",
        }}
      />
    </div>
  );
}
