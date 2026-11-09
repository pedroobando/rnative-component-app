This is an Expo/React Native mobile application. Prioritize mobile-first patterns, performance, and cross-platform compatibility.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

## Commands

Use `bunx` instead of `npx` if the project uses bun (`bun.lock` present).

```bash
npx expo install <package>  # ALWAYS use instead of npm/yarn/pnpm/bun add — resolves SDK-compatible versions
npx expo start              # start the dev server
npx expo lint               # lint
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
```

Run lint and typecheck before declaring any task done.

## Navigation & Routing

- Use **Expo Router** for all navigation. Routes live in `src/app/` — every file there is a screen, `_layout.tsx` files define navigators. Keep non-route code (components, hooks, utils) outside `src/app/`.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- Docs: https://docs.expo.dev/router/introduction.md

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`) — no local Xcode or Android Studio required. Run EAS CLI as `bunx eas-cli <command>` in Bun projects, or `npx eas-cli@latest <command>` otherwise; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

## Skills

Seven skills are installed. Read the relevant `SKILL.md` before acting on its topic.

### Project skills (`.agents/skills/`)

- **expo-router** (`.agents/skills/expo-router/SKILL.md`) — navigation and routing for Expo Router: file-based routes, groups, dynamic routes, `Link` with previews, native Stack, page titles, modals and form sheets, NativeTabs, headers and toolbars, header search bars. See `references/` for route structure, tabs, form sheets, search, zoom transitions.
- **expo-animation** (`.agents/skills/expo-animation/SKILL.md`) — animating anything in an Expo app: gestures, sheets, screen transitions, press feedback, haptics; decides what to animate, which thread it runs on, which properties, spring vs. timing, and how motion degrades. Uses Reanimated, Gesture Handler, Expo Router and `expo-haptics`. For web animation use `animate`. See also `RECIPES.md`.
- **expo-native-ui** (`.agents/skills/expo-native-ui/SKILL.md`) — building native-feeling screens: Apple HIG styling, semantic colors, native controls, SF Symbols, media, visual effects, gradients, storage, responsive layout. See `references/` for controls, gradients, icons, media, storage, visual effects, WebGPU/Three.
- **expo-dev-client** (`.agents/skills/expo-dev-client/SKILL.md`) — building and distributing Expo development clients locally or via TestFlight for internal testing. For production TestFlight releases and store submission, use the `eas-app-stores` skill.
- **vercel-react-native-skills** (`.agents/skills/vercel-react-native-skills/SKILL.md`) — React Native/Expo performance best practices (Vercel): component authoring, list performance, animations, native modules. Individual rules live in `rules/` (e.g. `list-performance-*`, `animation-gpu-properties`, `ui-styling`, `react-compiler-*`).

### Global skills (`~/.agents/skills/`)

- **context7-mcp** (`~/.agents/skills/context7-mcp/SKILL.md`) — use whenever a question involves a library, framework or API reference (React, Expo, React Navigation, TanStack, Supabase…) or needs code examples. Fetch current docs instead of relying on memory: `resolve-library-id` → pick best match → `query-docs` (one concept per query, prefer version-specific IDs).
  - The Context7 MCP server is already configured **for this project only** in `.pi/mcp.json` (`context7` → `https://mcp.context7.com/mcp`, tools: `resolve-library-id`, `query-docs`). It requires project trust; after changing `.pi/mcp.json` run `/reload` in the session (or `pi mcp list` from the shell) to pick it up. If the tools are unavailable, fall back to the official docs URL directly.
- **find-skills** (`~/.agents/skills/find-skills/SKILL.md`) — use when the user asks for a capability that may exist as a skill ("how do I do X", "find a skill for X"). Check the [skills.sh leaderboard](https://skills.sh/) first, then `npx skills find <query>`; verify quality (install count ≥1K, reputable owner, repo stars) before recommending, and offer to install with `npx skills add <owner/repo@skill> -g -y`.

Prefer these over guessing APIs: `AGENTS.md`/Expo docs first for Expo specifics, the Expo skills above for router/UI/animation work, and Context7 for third-party libraries.

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md
