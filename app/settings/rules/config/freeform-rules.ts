export const RULES_CONTENT = {
  orgRules: {
    title: "Organization Rules",
    description:
      "Define organization-wide guidelines that apply across all repositories and users within the organization.",
    placeholder:
      "## Organization Overview\n" +
      "This organization is...\n\n" +
      "## Tech Stack\n" +
      "- Frontend: React, Next.js\n" +
      "- Backend: Node.js, Python\n\n" +
      "## Coding Standards\n" +
      "1. Keep code concise and minimize line count\n" +
      "2. Comments are unnecessary\n" +
      "3. Unit tests are mandatory",
  },

  repoRules: {
    title: "Repository Rules",
    description:
      "Define repository-specific guidelines that apply across all issues and users within the repository. Write any coding standards, preferences, or requirements that GitAuto should follow when generating tests for this repository.",
    placeholder:
      "## Repository Purpose\n" +
      "This repository is...\n\n" +
      "## Detailed Tech Stack\n" +
      "- Primary language: Python 3.12\n" +
      "- Hosting: AWS Lambda\n" +
      "- Database: Supabase (PostgreSQL)\n\n" +
      "## Additional Coding Guidelines\n" +
      "1. Always use type hints in Python\n" +
      "2. Prefer async/await for database operations\n" +
      "3. Use pytest fixtures for test data setup\n\n" +
      "## Custom Requirements\n" +
      "- Follow PEP 8 style guide strictly\n" +
      "- Mock external API calls in tests\n" +
      "- Use descriptive variable names\n\n" +
      "Note: Use the Structured Rules section above for detailed configuration options. This free-form text area is for additional context and specific requirements not covered by the structured settings.",
  },

  userRules: {
    title: "User Rules",
    description:
      "Define personal guidelines that apply only to you across all organizations and repositories.",
    placeholder:
      "## Coding Preferences\n" +
      "1. Prefer minimum code changes\n" +
      "2. Prefer no comments\n" +
      "3. Prefer early returns\n\n",
  },
} as const;
