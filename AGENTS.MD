# Agent Guide

Welcome! This repo ships a Bun-first toolchain for a lightweight Yamli cache helper. Please follow the conventions below when contributing.

## Repository layout
- `src/` holds all TypeScript sources. Stick to `.ts` extensions on relative imports and colocate tests as `*.test.ts` next to the units under test.
- `scripts/tsdown.ts` is the single entry point for builds. It shells out to `tsdown` (Rolldown-based) with the settings defined in `tsdown.config.ts`.
- `mock/` contains canned Yamli responses that drive integration-style tests (see `src/index.test.ts`).
- `tsconfig.json` is for editor tooling, while `tsconfig.build.json` powers declaration output when necessary.
- `README.md` documents the public API; keep it in sync whenever exported functions change.

## Tooling & commands
- Use Bun for everything: `bun run build`, `bun test`, and `bun run lint` (Biome) should all pass before committing.
- The build emits `dist/index.js`, `dist/index.js.map`, and type declarations. These artifacts are ignored in git but must exist when publishing.
- Run `bun update --latest` when dependency bumps are requested. This keeps `package.json` and `bun.lockb` aligned.

## Coding conventions
- Follow Biome's defaults (`indentWidth: 4`, ESM imports, no semicolons unless required).
- Prefer small, focused helpers in `src/utils/`; keep shared constants in `src/utils/constants.ts`.
- Export only the documented surface (`initCache`, `disableAnalytics`, and shared types) from `src/index.ts`.
- Favor descriptive variable names and write JSDoc for any exported function.

Thanks and happy caching!
