---
layout: post
title: "Vibe Coding from My Phone: Building CI/CD Infrastructure for Mobile-Only Development"
date: 2026-01-01
tags: mobile-development ci-cd ai-assisted-coding infrastructure github-actions testing
---

## Table of Contents

- [Background: Vacation Coding Without a Laptop](#background-vacation-coding-without-a-laptop)
- [The Problem: No Local Dev Environment](#the-problem-no-local-dev-environment)
- [The Goal: One-Click PR Verification](#the-goal-one-click-pr-verification)
- [The Solution: Infrastructure Before Features](#the-solution-infrastructure-before-features)
- [The Result: Phone-Only Development Works](#the-result-phone-only-development-works)
- [Takeaways: Two Essential Requirements](#takeaways-two-essential-requirements)

---

_AI Disclaimer: This post was dictated by me and polished by AI. [And yes, I vibe coded from my phone to add this post to my blog repo](https://github.com/david-wolgemuth/david-wolgemuth.github.io/pull/5)_

**Dragon Quest Solitaire:**
- [Play the game](https://david-wolgemuth.github.io/dragon-quest-solitaire/)
- [View the repo](https://github.com/david-wolgemuth/dragon-quest-solitaire)

---

## Background: Vacation Coding Without a Laptop

Over Christmas break, I got hooked on [dragonsweeper](https://danielben.itch.io/dragonsweeper/)—a GREAT browser game that reminded me of a solitaire dungeon crawler card-game I'd started building two years ago in vanilla JavaScript. I'd lost steam on it back then, but with current AI coding tools, it seemed like a good time to pick it back up.

The catch: I was on vacation. Long car rides, not my turn to drive, didn't want to open my laptop. So I decided to vibe code the whole thing from my phone using the Claude app.


<figure>
<img alt="Tutorial feature in the game" src="/assets/images/tutorial-feature.jpg" />
<figcaption>New tutorial feature added to my game</figcaption>
</figure>


## The Problem: No Local Dev Environment

Vibe coding on mobile means you can't run anything locally. No dev server, no test suite, no browser pointed at localhost. You're writing code blind.

This was also a two-year-old codebase with real complexity—game rules, card interactions, state management. I didn't want the AI to just rewrite everything. I wanted to maintain the feel of the app and ensure the game rules stayed intact.

## The Solution: Infrastructure Before Features

Three pieces:

### 1. PR Preview Deployments + Auto-Generated QA Links

**URL State Serialization**: Full game state encoded in the URL as base64 (health, gems, inventory, dungeon grid, fate deck state). Any scenario becomes a shareable, bookmarkable link.

GitHub Actions workflow that:
- Deploys each PR to GitHub Pages (`/pr-preview/pr-16/`)
- Runs integration tests that generate fixtures (saved game states)
- Converts fixtures to URL state
- Posts a comment on the PR with clickable links to each scenario

Result in the PR comment:

```markdown
🚀 Preview deployed!

🎮 [Base Game](.../pr-4/?state=abc)
🌱 [Early game scenario](.../pr-4/?state=def)
⚔️ [Dragon Queen battle](.../pr-4/?state=ghi)
✅ [Gem damage reduction test](.../pr-4/?state=jkl)
```

Tap a link, game loads in that exact state, QA on my phone.

<figure>
<img alt="GitHub PR comment showing QA links" src="/assets/images/pr-qa-links.jpg" />
<figcaption>Custom QA environments within GitHub pages. And links of various game states generated from integration tests. So I can QA without having to do a bunch of work</figcaption>
</figure>

### 2. Mobile Debugging Infrastructure

On mobile, you can't just open DevTools. I built two solutions:

1. custom debug log that appends messages to a hidden div on the page
2. integrated [eruda](https://eruda.liriliri.io/)—a mobile-friendly devtools library that gives console, network, elements, etc.

<figure>
<img alt="Mobile debugging screenshot showing JavaScript errors" src="/assets/images/mobile-debugging.jpg" />
<figcaption>Mobile isn't the best for debugging. JavaScript errors on the front end. Had to set up some things to help me.</figcaption>
</figure>

<figure>
<img alt="Custom debug log interface" src="/assets/images/debug-log.jpg" />
<figcaption>First started with a custom debug log.</figcaption>
</figure>

<figure>
<img alt="Eruda development tool interface on mobile" src="/assets/images/eruda-debug.jpg" />
<figcaption>There's a tool here which I found for displaying a full development debug tool set on mobile called <a href="https://eruda.liriliri.io/">eruda</a></figcaption>
</figure>

### 3. Markdown-Based Todo System & Contribution Guide

Instead of GitHub Issues or external tools, everything lives in the repo:

- `todos/README.md` — master list with priority, t-shirt size, status
- `todos/AAJ-young-dragon.md` — individual task specs with acceptance criteria

```markdown
## 🔥 Critical (P0)
- [ ] P0 | L | [#AAO](AAO-gem-damage-reduction.md) | Gem damage reduction

## ✅ Completed
- [x] [#AAJ](AAJ-young-dragon.md) | Young Dragon gems - Fixed in PR #10
```

The `CONTRIBUTING.md` file defines how to structure PRs, the test-first workflow, fixture creation, and todo updates. When I start a session: *"Look at the backlog, find a high priority item, work on it, mark it done in the PR."* The AI reads the contributing guide and knows exactly what to do.

Benefits:
- Documentation stays with code
- PRs update the todo list in the same commit
- AI can read the backlog and pick up tasks
- No sync issues, no external dependencies

<figure>
<img alt="Claude AI chat showing simple contribution workflow" src="/assets/images/claude-contribution.jpg" />
<figcaption>Final state of simply telling the AI to make a contribution. No thought prompt</figcaption>
</figure>

## Conclusion: Phone-Only Development is Possible

I will (hopefully) never need to vibe code from my phone again, BUT this experiment proved it's possible with the right infrastructure.

Essential requirements:

1. Ability to QA changes

- PR Environments
- Auto-generated scenario links from tests

2. Sanity in your backlog and contribution process

- Markdown-based todo system
- Clear contribution guide

3. Mobile debugging tools

- Custom or third-party mobile devtools

---

*Dragon Quest Solitaire is still in progress. [dragonsweeper](https://danielben.itch.io/dragonsweeper/) is what got me back into it.*
