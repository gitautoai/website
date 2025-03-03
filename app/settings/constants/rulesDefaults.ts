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
      "Define repository-specific guidelines that apply across all issues and users within the repository.",
    placeholder:
      "## Repository Purpose\n" +
      "This repository is...\n\n" +
      "## Detailed Tech Stack\n" +
      "- Primary language: Python 3.12\n" +
      "- Hosting: AWS Lambda\n" +
      "- Database: Supabase (PostgreSQL)\n\n" +
      "## Coding Standards\n" +
      "1. Unit test coverage must be 100% for all new changes\n" +
      "2. Type safety is unnecessary in Python\n\n",
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
