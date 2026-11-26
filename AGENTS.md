# BeanSource — Agent Instructions

BeanSource is a premium Coorg-origin coffee retail and B2B e-commerce platform.

Authoritative requirements are in [docs/PROJECT_SPEC.md](docs/PROJECT_SPEC.md).
Implementation status is in [docs/PROGRESS.md](docs/PROGRESS.md).

## Rules

- Preserve existing architecture and working functionality.
- Do not integrate Shopify.
- Inspect relevant files before making changes.
- Reuse existing components and dependencies.
- Never fabricate prices, inventory, product attributes or payment success.
- Display pricing only within the retail shopping journey.
- IMG_3176 and IMG_3177 are Robusta photographs.
- Preserve the original BeanSource logo.
- Never use “Specialty Coffee” in branding.
- Keep secrets server-side.
- Do not modify production infrastructure without approval.
- Run relevant tests after implementation.

## Efficiency

- Read only relevant specification sections.
- Prefer targeted changes over full rewrites.
- Avoid unnecessary dependencies and abstractions.
- Do not reprint source code in responses.
- Keep explanations concise.
- Update PROGRESS.md after meaningful milestones.
- Continue independent work when external dependencies are blocked.
- Report completed changes, verification results, blockers and next steps.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
