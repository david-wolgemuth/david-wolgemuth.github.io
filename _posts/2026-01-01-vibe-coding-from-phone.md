---
layout: post
title: "Vibe Coding from My Phone: Building CI/CD Infrastructure for Mobile-Only Development"
date: 2026-01-01
tags: mobile-development ci-cd ai-assisted-coding infrastructure github-actions testing
---

*This post was dictated by me and polished by AI. [And yes, I vibe coded from my phone to add this post to my blog repo](https://github.com/david-wolgemuth/david-wolgemuth.github.io/pull/5)*

**Dragon Quest Solitaire:**
- [Play the game](https://david-wolgemuth.github.io/dragon-quest-solitaire/)
- [View the repo](https://github.com/david-wolgemuth/dragon-quest-solitaire)

---

## Background

Over Christmas break, I got hooked on [dragonsweeper](https://danielben.itch.io/dragonsweeper/)—a simple browser game that reminded me of a solitaire dungeon crawler I'd started building two years ago in vanilla JavaScript. I'd lost steam on it back then, but with current AI coding tools, it seemed like a good time to pick it back up.

The catch: I was on vacation. Long car rides, not my turn to drive, didn't want to open my laptop. So I decided to vibe code the whole thing from my phone using the Claude app.

## The Problem

Vibe coding on mobile means you can't run anything locally. No dev server, no test suite, no browser pointed at localhost. You're writing code blind.

This was also a two-year-old codebase with real complexity—game rules, card interactions, state management. I didn't want the AI to just rewrite everything. I wanted to maintain the feel of the app and ensure the game rules stayed intact.

**Before I could vibe code features, I needed to vibe code infrastructure.**

## The Goal

Every PR should give me a clickable link that loads the game in a testable state, directly on my phone.

No local environment. No terminal. Open PR → click link → verify it works.

## The Solution

Three pieces:

### 1. URL State Serialization

Full game state encoded in the URL as base64:
- Health, gems, inventory
- Dungeon grid (card positions, face-up/down)
- Fate deck state

Any scenario becomes a shareable, bookmarkable link. Found a bug? Copy the URL.

### 2. PR Preview Deployments + Auto-Generated QA Links

GitHub Actions workflow that:
- Deploys each PR to GitHub Pages (`/pr-preview/pr-16/`)
- Runs integration tests that generate fixtures (saved game states)
- Converts fixtures to URL state
- Posts a comment on the PR with clickable links to each scenario

Result in the PR comment:
```
🚀 Preview deployed!

🎮 Base Game - Fresh start
🌱 Early game scenario
⚔️ Dragon Queen battle
✅ Gem damage reduction test
```

Tap a link, game loads in that exact state, QA on my phone.

### 3. Markdown-Based Todo System

Instead of GitHub Issues or external tools, everything lives in the repo:

- `todos/README.md` — master list with priority, t-shirt size, status
- `todos/AAJ-young-dragon.md` — individual task specs with acceptance criteria

```markdown
## 🔥 Critical (P0)
- [ ] P0 | L | [#AAO](AAO-gem-damage-reduction.md) | Gem damage reduction

## ✅ Completed
- [x] [#AAJ](AAJ-young-dragon.md) | Young Dragon gems - Fixed in PR #10
```

Benefits:
- Documentation stays with code
- PRs update the todo list in the same commit
- AI can read the backlog and pick up tasks
- No sync issues, no external dependencies

## Tying It Together

The `CONTRIBUTING.md` file is the AI's entry point. It defines:
- How to structure a PR
- Test-first workflow
- Fixture creation for QA scenarios
- Updating todos when done

When I start a session: *"Look at the backlog, find a high priority item, work on it, mark it done in the PR."* The AI reads the contributing guide and knows exactly what to do.

Out-of-scope items become new todos rather than scope creep.

## Why It Works

The infrastructure keeps me in the loop without requiring a laptop:
- Every change is verifiable via PR preview links
- I'm still making the call on whether code is correct
- The AI assists with velocity, I maintain quality control

## Outcome

Over Christmas break, mostly from my phone:
- Built CI/CD preview system
- Added URL state serialization
- Created 14+ test fixtures with auto-generated QA links
- Set up markdown todo system with 35+ task specs
- Shipped actual features and bug fixes

No laptop opened.

## Takeaways

For mobile vibe coding on a project you care about:

1. **URL state serialization** — Shareable links that reproduce exact scenarios
2. **Automated PR previews** — GitHub Pages + Actions, live deployment per PR
3. **In-repo task management** — Markdown todos the AI can read and update
4. **Test fixtures as QA scenarios** — Integration tests generate the states you need to verify
5. **Document how to contribute** — `CONTRIBUTING.md` gives the AI context on your workflow

The infrastructure took maybe a day spread across the road trip. Everything after that was just working on my game from my phone.

---

*Dragon Quest Solitaire is still in progress. [dragonsweeper](https://danielben.itch.io/dragonsweeper/) is what got me back into it.*
