export const STRUCTURED_RULES_CONFIG = {
  codingRules: {
    title: "Coding Rules",
    description: "Define coding standards and patterns for GitAuto-generated code",
    rules: [
      {
        key: "enforceOneFunctionPerFile",
        label: "Enforce one function per file",
        description:
          "Each file should contain only one main function to improve testability and maintainability",
        type: "boolean",
        default: true,
      },
      {
        key: "enforceOneResponsibilityPerFile",
        label: "Enforce one responsibility per file",
        description: "Each file should have a single, well-defined responsibility",
        type: "boolean",
        default: true,
      },
      {
        key: "preferEarlyReturnsToReduceNesting",
        label: "Prefer early returns to reduce nesting",
        description:
          "Use early returns, guard clauses, and similar techniques to keep code shallow and readable",
        type: "boolean",
        default: true,
      },
      {
        key: "preferConciseCodeTechniques",
        label: "Prefer concise code techniques",
        description:
          "Use shorthand syntax, omit braces when possible, and apply other techniques to reduce line count",
        type: "boolean",
        default: true,
        examples: {
          Enabled:
            "if (error) return; // ternary operators, optional chaining, arrow functions, destructuring",
          Disabled: "if (error) { return; } // explicit braces, verbose syntax",
        },
      },
      {
        key: "allowCreatingIntermediateLayers",
        label: "Allow creating intermediate layers",
        description:
          "Allow creating wrapper functions or helper layers when they improve code organization",
        type: "boolean",
        default: false,
      },
      {
        key: "codePatternStrategy",
        label: "Code pattern strategy",
        description: "How GitAuto should handle code patterns when generating tests and code",
        type: "select",
        options: ["Consistency first", "Best practices first"],
        default: "Best practices first",
        examples: {
          "Consistency first":
            "Always match your repository's existing code patterns, even if they're not optimal",
          "Best practices first":
            "Use best practices when possible, fall back to existing patterns when they don't conflict",
        },
      },
      {
        key: "preferredApiApproach",
        label: "Preferred API approach",
        description: "Preferred API pattern for new code and tests",
        type: "select",
        options: ["REST API first", "GraphQL first", "Use both (context-dependent)", "Auto-detect"],
        default: "GraphQL first",
        examples: {
          "REST API first": "Prefer REST endpoints for CRUD operations and simple data access",
          "GraphQL first": "Prefer GraphQL for complex queries and data relationships",
          "Use both (context-dependent)":
            "Choose REST for simple operations, GraphQL for complex queries",
          "Auto-detect": "Analyze existing codebase patterns to determine the best approach",
        },
      },
      {
        key: "fixUnrelatedIssuesWhenNoticed",
        label: "Fix unrelated issues when noticed",
        description: "Allow GitAuto to fix unrelated issues it notices while working on tests",
        type: "boolean",
        default: false,
      },
    ],
  },
  commentRules: {
    title: "Comment Rules",
    description: "Configure comment generation preferences for GitAuto-generated code",
    rules: [
      {
        key: "enableCommentsInGeneratedSourceCode",
        label: "Enable comments in generated source code",
        description: "Include explanatory comments in source code files created by GitAuto",
        type: "boolean",
        default: false,
      },
      {
        key: "enableCommentsInGeneratedTestCode",
        label: "Enable comments in generated test code",
        description: "Include explanatory comments in test files created by GitAuto",
        type: "boolean",
        default: false,
      },
      {
        key: "preferredCommentLanguage",
        label: "Preferred comment language",
        description: "Language for comments in GitAuto-generated code",
        type: "select",
        options: ["Auto-detect", "English"],
        default: "Auto-detect",
        examples: {
          "Auto-detect": "Detect language from existing codebase comments",
          English: "Always use English for comments",
        },
      },
      {
        key: "includeJSDocOrDocstringComments",
        label: "Include JSDoc/docstring comments",
        description: "Add JSDoc/docstring comments to functions and classes",
        type: "boolean",
        default: false,
      },
      {
        key: "allowTodoCommentsInGeneratedCode",
        label: "Allow TODO comments in generated code",
        description: "Allow GitAuto to add TODO comments for incomplete or placeholder code",
        type: "boolean",
        default: false,
      },
    ],
  },
  testFileLocationAndNaming: {
    title: "Test File Location and Naming Rules",
    description: "Configure test file placement and naming conventions",
    rules: [
      {
        key: "placeTestFilesNextToSourceFiles",
        label: "Place test files next to source files",
        description: "Choose where test files should be located relative to source files",
        type: "boolean",
        default: true,
        examples: {
          Enabled:
            "src/auth.py → src/auth.test.py or src/components/Button.tsx → src/components/Button.test.tsx",
          Disabled:
            "src/auth.py → tests/auth.test.py or src/components/Button.tsx → tests/components/Button.test.tsx",
        },
      },
      {
        key: "preferredTestFileNamingConvention",
        label: "Preferred test file naming convention",
        description: "Choose how test files should be named",
        type: "select",
        options: [
          "Auto-detect existing patterns",
          "Auto-detect language best practices",
          "filename.test.ext (JS/TS style)",
          "filename.spec.ext (JS/TS style)",
          "test_filename.ext (Python style)",
          "filename_test.ext (Go style)",
          "filenameTest.ext (Java/C# style)",
          "filenameTests.ext (Java/C# style)",
          "filename_spec.ext (Ruby/Rust style)",
          "Custom",
        ],
        default: "Auto-detect language best practices",
        examples: {
          "Auto-detect existing patterns":
            "Analyze existing test files in the project to determine naming pattern",
          "Auto-detect language best practices":
            "JS/TS: .test.js/.spec.ts, Python: test_.py, Java: Test.java, Go: _test.go, Ruby: _spec.rb etc.",
          "filename.test.ext (JS/TS style)": "Button.tsx → Button.test.tsx",
          "filename.spec.ext (JS/TS style)": "Button.tsx → Button.spec.tsx",
          "test_filename.ext (Python style)": "button.py → test_button.py",
          "filenameTest.ext (Java/C# style)": "Button.java → ButtonTest.java",
          "filenameTests.ext (Java/C# style)": "Button.java → ButtonTests.java",
          "filename_test.ext (Go/Python style)": "button.py → button_test.py",
          "filename_spec.ext (Ruby/Rust style)": "button.rb → button_spec.rb",
          Custom: "Use custom pattern below",
        },
      },
      {
        key: "customTestFileNamingPattern",
        label: "Custom test file naming pattern",
        description: "Custom pattern for test file naming (use {filename} as placeholder)",
        type: "text",
        default: "",
        placeholder: "e.g., {filename}.spec.tsx or spec_{filename}.tsx",
        dependsOn: "preferredTestFileNamingConvention",
        dependsOnValue: "Custom",
      },
    ],
  },
  testConstantsRules: {
    title: "Test Constants Rules",
    description: "Configure test constants management",
    rules: [
      {
        key: "testConstantsManagementStrategy",
        label: "Test constants management strategy",
        description: "How to handle commonly used test constants",
        type: "select",
        options: [
          "Auto-detect from existing tests",
          "Use centralized constants file",
          "No centralized constants",
        ],
        default: "Auto-detect from existing tests",
        examples: {
          "Auto-detect from existing tests":
            "Analyze existing test files to identify frequently used constants and their location automatically",
          "Use centralized constants file":
            "Use or create a centralized constants file at your specified location and populate it with commonly used test data",
          "No centralized constants": "Keep constants inline within individual test files",
        },
      },
      {
        key: "preferredTestConstantsFileLocation",
        label: "Preferred test constants file location",
        description: "Where to store centralized test constants",
        type: "select",
        options: [
          "Auto-detect from project structure",
          "tests/constants (auto-extension)",
          "test/constants (auto-extension)",
          "__tests__/constants (auto-extension)",
          "spec/constants (auto-extension)",
          "Custom path",
        ],
        default: "Auto-detect from project structure",
        examples: {
          "Auto-detect from project structure":
            "Analyze existing test directory structure and choose appropriate location",
          "tests/constants (auto-extension)":
            "tests/constants.js, tests/constants.ts, tests/constants.py, etc.",
          "test/constants (auto-extension)":
            "test/constants.js, test/constants.ts, test/constants.py, etc.",
          "__tests__/constants (auto-extension)":
            "__tests__/constants.js, __tests__/constants.ts, etc.",
          "spec/constants (auto-extension)": "spec/constants.rb, spec/constants.js, etc.",
          "Custom path": "Specify custom location for test constants file",
        },
        dependsOn: "testConstantsManagementStrategy",
        dependsOnValue: "Use centralized constants file",
      },
      {
        key: "customTestConstantsPath",
        label: "Custom test constants file path",
        description: "Custom path for test constants file (without extension)",
        type: "text",
        default: "",
        placeholder: "e.g., src/test-utils/constants or helpers/test-data",
        dependsOn: "preferredTestConstantsFileLocation",
        dependsOnValue: "Custom path",
      },
    ],
  },
  unitTestRules: {
    title: "Unit Test Rules",
    description: "Configure unit test generation preferences",
    rules: [
      {
        key: "preferFunctionStyleOverClassStyleInTests",
        label: "Prefer function style over class style in tests",
        description: "Prefer functional programming patterns in tests",
        type: "boolean",
        default: true,
      },
      {
        key: "enableComprehensiveTestCoverageIncludingEdgeCases",
        label: "Enable comprehensive test coverage including edge cases",
        description: "Generate tests for edge cases, error conditions, and boundary values",
        type: "boolean",
        default: true,
      },
      {
        key: "allowRefactoringSourceCodeBeforeWritingTests",
        label: "Allow refactoring source code before writing tests",
        description:
          "Allow GitAuto to refactor and improve source code structure before generating tests to keep the test code clean and readable",
        type: "boolean",
        default: true,
      },
    ],
  },
  componentTestRules: {
    title: "Component Test Rules",
    description: "Configure component test preferences (React, Vue, etc.)",
    rules: [
      {
        key: "preferFunctionComponentsOverClassComponentsInTests",
        label: "Prefer function components over class components in tests",
        description: "Use functional components in test code when possible",
        type: "boolean",
        default: true,
      },
      {
        key: "enforceComponentIsolationInTests",
        label: "Enforce component isolation in tests",
        description:
          "Test components in isolation from their dependencies by mocking or stubbing external dependencies",
        type: "boolean",
        default: true,
      },
      {
        key: "enableMockingExternalDependenciesInComponentTests",
        label: "Enable mocking external dependencies in component tests",
        description: "Mock external APIs, services, and third-party libraries in component tests",
        type: "boolean",
        default: true,
      },
    ],
  },
} as const;

// Simpler type extraction - get all rule types directly
type AllRules = {
  [K in keyof typeof STRUCTURED_RULES_CONFIG]: (typeof STRUCTURED_RULES_CONFIG)[K]["rules"][number];
}[keyof typeof STRUCTURED_RULES_CONFIG];

export type StructuredRules = {
  [K in AllRules["key"]]: Extract<AllRules, { key: K }> extends { default: infer V } ? V : never;
};

// Extract default values from config
export const DEFAULT_STRUCTURED_RULES = Object.values(STRUCTURED_RULES_CONFIG)
  .flatMap((section) => [...section.rules])
  .reduce(
    (acc, rule) => {
      acc[rule.key as keyof StructuredRules] = rule.default;
      return acc;
    },
    {} as Record<string, boolean | string>,
  ) as StructuredRules;
