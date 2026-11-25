# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A personalized math learning-path site for one class (原民班) of a teacher. It is a static site with no build step, no package manager and no test suite. It is served by GitHub Pages from `main` (`https://tyz0516.github.io/learn-path/`). All UI text, commit messages and README are in Traditional Chinese (zh-Hant-TW). Keep that convention.

- `index.html`: the student page (log in with seat number + name; route, concept widgets, three practice tiers, exit ticket).
- `admin.html`: the teacher dashboard (import students, view progress and logs, print per-student practice packets).

## Running / testing

Serve the folder statically and open it in a browser. For example:

```bash
python3 -m http.server 8000
```

- `?demo` forces demo mode on either page. Data goes to the browser's localStorage under key `learn-demo-v1`, and the 5 mock students from `mock.js` can be clicked. Nothing is written to Firebase. Use `admin.html?demo` → 「清空示範資料」 to reset the mock students after route rules change.
- `?preview` is the teacher preview on `index.html`. All modules are open, you can switch tiers freely, and nothing is saved. In Firebase mode it requires the teacher's Google login in the same browser. Use `?preview&demo` locally.
- `admin.html#print-<seat>` or `#print-all` opens the print packet view directly.
- There is no automated test suite. Verify changes by loading the pages (Playwright/Chromium is available) and by exercising `window.Learn` in the console. For example, generate questions with `Learn.makeQ(mid, tier, seed)` and check them with `q.check(answer)`.

## Architecture

The scripts load as plain globals, in this order on both pages: `config.js` → `modules.js` → `mock.js` → `store.js` → an inline script.

- **`config.js`** sets `window.LEARN_CONFIG.firebase`. If `apiKey` is `'請貼上'`, the site runs in demo mode. The committed file holds the real (client-side, public) Firebase config. Never replace it with the placeholder, for example from an uploaded zip.
- **`store.js`** sets `window.Store` and `window.StoreReady`. These are two interchangeable backends with the same async API (`getStudent`, `getProgress`, `saveModule`, `log`, `listStudents`, `putStudents`, …): `Demo` (localStorage) and `Fire` (Firebase Realtime DB compat SDK 10.12.2 loaded from gstatic; anonymous auth for students, Google popup for the teacher). If Firebase init fails, it falls back to Demo. The DB paths are `learn/students/{seat}`, `learn/progress/{seat}/{moduleId}` and `learn/logs/{seat}/{pushId}`. The security rules live in README.md and are pasted into the Firebase console by hand. Logs are append-only and students can write only progress and logs.
- **`modules.js`** sets `window.Learn`. It is the whole curriculum and the routing logic:
  - `CATALOG`: `[id, name, grade(0=小一 … 8=九年級), pretest question numbers]`. It is ordered low grade → high grade. That order is load-bearing, because routes sort by grade and then by catalog index.
  - `BANDS` and `diagnose(s)`: the 65-question pretest string (`c` correct, `w` wrong, `i` 不會, `b` blank) is turned into a starting grade.
  - `route(s)`: every module with a `w`/`i`/`b` question goes on the route, whatever the starting grade. `PRE` inserts prerequisite modules (for example `A-dist` before `A-lin`).
  - `record(x)`: turns an imported student into the stored student object. **Routes are computed at import time and stored**, so a routing-rule change only takes effect for a student once they are re-imported. Progress is kept on re-import.
  - `MOD[id]`: the module content, `{goal, wrong:{h,why}, concept[], widget:{init, printState, render, controls}, example, tiers:[基礎, 進階, 挑戰]}`. Each tier is a generator `r => question`, where `r` is a seeded RNG (`rng(seed)`). A question has either `mc` options with `ans`, or a `check(str) → {ok, note?}` built from the checker helpers (`numCheck`, `linCheck`, `quadCheck`, `pairCheck`, `ineqCheck`, `listCheck`, `ratioCheck`, `divCheck`, `timeCheck`, …). Answers go through `norm()`, which accepts full-width digits and symbols. Fractions use the exact rational helpers (`R`, `add`, `mul`, `eq`, …); never use floats. The `id` must match a `CATALOG` id. A new module shows up for students without recomputing routes.
- **`index.html` inline script**: the module tabs are 觀念 → 例題 → 練習 → 出場券. A practice set is 4 questions and passing needs 3 or more correct. All three tiers must pass before the exit ticket opens. The exit ticket is 3 questions (one per tier) and all 3 must be correct to mark the module `done`. Unlocking: modules below the student's starting grade (`lowOpen`) are all open, including off-route ones (`extras()`). Modules at or above the starting grade unlock in route order.
- **`admin.html` inline script**: imports pretest exports (via `Learn.record`), shows per-student stats and logs, and renders print packets (practice questions only) using each widget's `printState`.
- **PWA**: `manifest.webmanifest`, the icons and `sw.js`. The service worker is network-first and uses the cache only when offline, so deploys take effect right away. There is no cache-version bump to manage.

## Deploying

Merging to `main` is going live (「上線」). Test in a browser first, then push the working branch, and merge to `main` only when the user asks. If the README's file table, module count or usage notes go stale because of a change, update them (the README is the teacher's manual).
