# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

---

## 5. Website Visual Reference

Screenshots are stored in [`temporary screenshots/`](temporary%20screenshots/).

**Claude takes screenshots autonomously** using the Playwright MCP server (already configured globally). When the dev server is running:
- Use Playwright to navigate to `localhost` and take a screenshot before and after any UI change.
- Save screenshots to `temporary screenshots/` with descriptive names (e.g., `homepage-before.png`, `product-page-after.png`).
- Read the saved screenshot to inspect the result visually — use this to catch layout bugs, missing styles, or broken elements before reporting the task done.
- Re-take screenshots after every meaningful UI change to verify it looks correct.

**Workflow for every UI task:**
1. Screenshot the current state → examine it.
2. Make the change.
3. Screenshot again → compare, fix any visual regressions.
4. Delete all screenshots from `temporary screenshots/` once you have finished using them (within ~5 minutes of taking them). Do not leave screenshots sitting in the folder after they have served their purpose.

> The user does not need to provide screenshots manually. Claude handles this end-to-end.
