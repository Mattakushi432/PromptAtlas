---
id: dockerfile-optimizer
title: Dockerfile Optimizer
category: coding
tags: [devops, docker, performance]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-29
---

## Description
Rewrites a Dockerfile to reduce image size and build time — multi-stage builds, layer caching order, base image choice — with the same runtime behavior. For a concrete Dockerfile that's grown slow to build or produces a bloated image.

## When to use it
- A Docker image has grown large enough to slow down deploys or push/pull times, and needs concrete size reduction.
- CI build times are dominated by Docker builds re-downloading/reinstalling dependencies that haven't changed.
- Reviewing a new Dockerfile before it becomes the team's standard, to catch obvious inefficiencies early.

## The Prompt

```
You optimize a Dockerfile for image size and build time, preserving identical runtime behavior — the resulting container must behave the same, just build faster and smaller.

Dockerfile: {{DOCKERFILE}}
Language/framework context (optional, if not obvious from the Dockerfile): {{APP_CONTEXT}}
Constraints (optional — e.g. "must use a specific base image for compliance", "can't change the build tool"): {{CONSTRAINTS}}

Instructions:
1. Check layer caching order: are dependency manifest files (package.json, requirements.txt, go.mod, Cargo.toml) copied and dependencies installed BEFORE the rest of the application source is copied? If not, every source change invalidates the dependency-install cache layer unnecessarily — reorder so slow-changing layers (dependencies) come before fast-changing ones (source code).
2. Recommend multi-stage builds if not already used: a build stage with full build tooling (compilers, dev dependencies) producing artifacts, and a slim final runtime stage that copies only the built artifacts and runtime dependencies — this alone often cuts image size dramatically for compiled languages or apps with heavy build-time-only dependencies.
3. Check the base image choice: is a full OS image used where a slim or distroless variant would work (e.g., `node:20` vs `node:20-slim` vs a distroless variant), and is the tradeoff (smaller image vs. missing shell/debugging tools in production) appropriate for this use case?
4. Check for unnecessary layer bloat: package manager caches not cleaned up in the same layer they're created (a `RUN apt-get install && rm -rf /var/lib/apt/lists/*` pattern, not two separate RUN commands, since Docker layers are cumulative — cleanup in a later layer doesn't shrink an earlier one), unnecessary files copied via a broad `COPY . .` without a `.dockerignore` excluding build artifacts/node_modules/.git.
5. Check for missed build parallelization or caching opportunities specific to the build tool (e.g., BuildKit cache mounts for package manager caches across builds, which persist even across cache-invalidating layer changes).
6. Verify the optimized Dockerfile preserves the original's runtime behavior exactly — environment variables, exposed ports, entrypoint/cmd, user/permissions — don't silently drop something like a non-root `USER` directive while optimizing.

Output format: the rewritten Dockerfile, followed by a bullet list of what changed and why, with the expected size/build-time impact of each change (qualitative if you can't measure it: "large," "moderate," "small").
```

## Variables
- `{{DOCKERFILE}}` — the Dockerfile to optimize. Required.
- `{{APP_CONTEXT}}` — the language/framework, if not obvious from the Dockerfile alone. Optional.
- `{{CONSTRAINTS}}` — any fixed requirements (base image, compliance, tooling) that limit the optimization. Optional.

## Example
**Input:** `{{DOCKERFILE}}` = a Node.js Dockerfile that does `COPY . .` then `RUN npm install` then `CMD`, using `node:20` as the base, no multi-stage build.

**Output (excerpt):**
```dockerfile
FROM node:20-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-slim
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY package.json ./
CMD ["node", "dist/index.js"]
```
*(followed by: "Reordered dependency install before source copy — LARGE impact on build time for source-only changes, since `npm ci` no longer reruns when only app code changes. Added multi-stage build separating build tooling from runtime — MODERATE impact on final image size. Switched to `node:20-slim` — MODERATE impact on image size.")*

## Tips & Variations
- For a monorepo with multiple services sharing a Dockerfile pattern, ask it to also flag opportunities for a shared base image layer across services to maximize cache reuse.
- If build time (not image size) is the primary concern, explicitly ask it to prioritize BuildKit cache mount recommendations over size-reduction techniques that don't help build speed (e.g., some layer-squashing approaches shrink the image but don't speed up builds).

## Changelog
- 1.0.0 (2026-08-29): Initial version.
