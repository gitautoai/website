#!/bin/bash
# Git pre-commit hook for the website repo.
# Install: ln -sf ../../scripts/git/pre_commit_hook.sh .git/hooks/pre-commit
set -uo pipefail

echo "=== Pre-commit hook ==="

STAGED_FILES=$(git diff --cached --name-only)
has_mdx=$(echo "$STAGED_FILES" | grep -q '\.mdx$' && echo 1 || echo 0)
has_md=$(echo "$STAGED_FILES" | grep -q '\.md$' && echo 1 || echo 0)
has_ts=$(echo "$STAGED_FILES" | grep -qE '\.(ts|tsx)$' && echo 1 || echo 0)
has_js=$(echo "$STAGED_FILES" | grep -qE '\.(js|jsx|mjs)$' && echo 1 || echo 0)

# Check main is merged (merge must be done before committing)
echo "--- check main ---"
git fetch origin main
if ! git merge-base --is-ancestor origin/main HEAD; then
    echo "FAILED: Branch is behind main. Run 'git merge origin/main' first."
    exit 1
fi

# Blog metadata length validation (title 50-60 with suffix, description 110-160)
if [ "$has_mdx" = "1" ]; then
    echo "--- blog metadata length check ---"
    npx tsx scripts/git/validate_blog_metadata.ts
    if [ $? -ne 0 ]; then
        echo "FAILED: Fix blog post metadata lengths before committing."
        exit 1
    fi
fi

# Generate TypeScript types
if [ "$has_ts" = "1" ]; then
    echo "--- types:generate ---"
    npm run types:generate
    if [ $? -ne 0 ]; then
        echo "FAILED: Type generation failed."
        exit 1
    fi
fi

# ESLint
if [ "$has_ts" = "1" ] || [ "$has_js" = "1" ]; then
    echo "--- eslint ---"
    npx eslint .
    if [ $? -ne 0 ]; then
        echo "FAILED: Fix ESLint errors before committing."
        exit 1
    fi
fi

# Markdown lint (only staged files to avoid pre-existing errors)
if [ "$has_md" = "1" ] || [ "$has_mdx" = "1" ]; then
    echo "--- markdownlint ---"
    STAGED_MD=$(echo "$STAGED_FILES" | grep -E '\.(md|mdx)$' || true)
    npx markdownlint-cli2 $STAGED_MD
    if [ $? -ne 0 ]; then
        echo "FAILED: Fix markdown lint errors before committing."
        exit 1
    fi
fi

# TypeScript type check
if [ "$has_ts" = "1" ]; then
    echo "--- tsc ---"
    npx tsc --noEmit
    if [ $? -ne 0 ]; then
        echo "FAILED: Fix TypeScript errors before committing."
        exit 1
    fi
fi

# Tests
if [ "$has_ts" = "1" ] || [ "$has_js" = "1" ]; then
    echo "--- jest ---"
    npx jest
    if [ $? -ne 0 ]; then
        echo "FAILED: Fix failing tests before committing."
        exit 1
    fi
fi

# Build
if [ "$has_ts" = "1" ]; then
    echo "--- build ---"
    npm run build
    if [ $? -ne 0 ]; then
        echo "FAILED: Build failed."
        exit 1
    fi
fi

echo "=== Pre-commit hook passed ==="
