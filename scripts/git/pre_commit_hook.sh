#!/bin/bash
# Git pre-commit hook for the website repo.
# Install: ln -sf ../../scripts/git/pre_commit_hook.sh .git/hooks/pre-commit
set -uo pipefail

echo "=== Pre-commit hook ==="

# Merge latest main
echo "--- merge main ---"
git fetch origin main && git merge origin/main
if [ $? -ne 0 ]; then
    echo "FAILED: Merge conflict with main. Resolve before committing."
    exit 1
fi

# Blog metadata length validation (title 50-60 with suffix, description 110-160)
echo "--- blog metadata length check ---"
npx tsx scripts/git/validate_blog_metadata.ts
if [ $? -ne 0 ]; then
    echo "FAILED: Fix blog post metadata lengths before committing."
    exit 1
fi

# Generate TypeScript types
echo "--- types:generate ---"
npm run types:generate
if [ $? -ne 0 ]; then
    echo "FAILED: Type generation failed."
    exit 1
fi

# ESLint
echo "--- eslint ---"
npx eslint .
if [ $? -ne 0 ]; then
    echo "FAILED: Fix ESLint errors before committing."
    exit 1
fi

# Markdown lint
echo "--- markdownlint ---"
npx markdownlint-cli2 "**/*.md" "#node_modules" "#.next"
if [ $? -ne 0 ]; then
    echo "FAILED: Fix markdown lint errors before committing."
    exit 1
fi

# TypeScript type check
echo "--- tsc ---"
npx tsc --noEmit
if [ $? -ne 0 ]; then
    echo "FAILED: Fix TypeScript errors before committing."
    exit 1
fi

# Tests
echo "--- jest ---"
npx jest
if [ $? -ne 0 ]; then
    echo "FAILED: Fix failing tests before committing."
    exit 1
fi

# Build
echo "--- build ---"
npm run build
if [ $? -ne 0 ]; then
    echo "FAILED: Build failed."
    exit 1
fi

echo "=== Pre-commit hook passed ==="
