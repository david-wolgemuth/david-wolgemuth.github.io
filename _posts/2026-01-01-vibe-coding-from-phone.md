---
layout: post
title: "Vibe Coding from My Phone: Building CI/CD Infrastructure for Mobile-Only Development"
date: 2026-01-01
tags: mobile-development ci-cd ai-assisted-coding infrastructure github-actions testing
---

## Table of Contents

- [Background: Vacation Coding Without a Laptop](#background-vacation-coding-without-a-laptop)
- [The Problem: No Local Dev Environment](#the-problem-no-local-dev-environment)
- [The Solution: Infrastructure Before Features](#the-solution-infrastructure-before-features)
  - [1. PR Preview Deployments + Auto-Generated QA Links](#1-pr-preview-deployments--auto-generated-qa-links)
  - [2. Mobile Debugging Infrastructure](#2-mobile-debugging-infrastructure)
  - [3. Markdown-Based Todo System & Contribution Guide](#3-markdown-based-todo-system--contribution-guide)
- [Conclusion: Phone-Only Development is Possible](#conclusion-phone-only-development-is-possible)

---

_AI Disclaimer: This post was dictated by me and polished by AI. [And yes, I vibe coded from my phone to add this post to my blog repo](https://github.com/david-wolgemuth/david-wolgemuth.github.io/pull/5)_

**Dragon Quest Solitaire:**
- [Play the game](https://david-wolgemuth.github.io/dragon-quest-solitaire/)
- [View the repo](https://github.com/david-wolgemuth/dragon-quest-solitaire)

---

## Background: Vacation Coding Without a Laptop

Over Christmas break, I got hooked on [dragonsweeper](https://danielben.itch.io/dragonsweeper/)—a GREAT browser game.  It made me want to keep developing my _own_ game which also has "Dragon" in the title.

It is a solitaire dungeon crawler card-game I started building two years ago in vanilla JavaScript, but lost steam on.  With current AI coding tools, I thought maybe I could kickstart development again.

The catch: I was on vacation and did NOT want to open my laptop.

I happened upon a [fun blog post from Simon Willison](https://simonwillison.net/2025/Dec/15/porting-justhtml/) where he talks about how he uses Claude Code from his phone, and was curious if I could do the same.

All of what you are about to see was developed 100% from my phone. Mostly while in the passenger seat of a car or while lounging on a couch watching christmas movies.

<figure>
<img alt="Tutorial feature in the game" src="/assets/images/tutorial-feature.jpg" />
<figcaption>New tutorial feature added to my game</figcaption>
</figure>


## The Problem: No Local Dev Environment

Vibe coding on mobile means you can't run anything locally. No dev server, no test suite, no browser pointed at localhost. You're writing code blind.

This was also a two-year-old codebase with real complexity—game rules, card interactions, state management. I didn't want the AI to just rewrite everything. I wanted to maintain the feel of the app and ensure the game rules stayed intact.

The project was already on GitHub and used basic Github Pages hosting.  But without pushing directly to main, I had no way to QA changes on mobile.

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
<figcaption>Custom QA environments within GitHub pages. And links of various game states generated from integration tests.</figcaption>
</figure>

### 2. Mobile Debugging Infrastructure

On mobile, you can't just open DevTools. I built two solutions:

1. custom debug log that appends messages to a hidden div on the page
2. integrated [eruda](https://eruda.liriliri.io/)—a mobile-friendly devtools library that gives console, network, elements, etc.

<figure>
<img alt="Mobile debugging screenshot showing JavaScript errors" src="/assets/images/mobile-debugging.jpg" />
<figcaption>Mobile browsers do not have devtools.  How to debug?</figcaption>
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

I didn't want to have the AI make gigantic PRs rewriting everything. I wanted small, test-driven contributions that didn't break existing functionality.  I had already had a small backlog of features and bugs in markdown files in the repo, so I formalized that into a simple todo system that the AI could read and follow.

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
<figcaption>Final state of simply telling the AI to make a contribution. Zero-thought prompt (could later be turned into a one-click "make contribution" button for full automation).</figcaption>
</figure>

## Conclusion: Phone-Only Development is Possible

I will (hopefully) never _need_ to vibe code from my phone, BUT this experiment proved it's possible with the right infrastructure.

Essential requirements:

1. Ability to QA changes
    - PR Environments
    - Auto-generated scenario links from tests
2. Mobile debugging tools
    - Custom or third-party mobile devtools
3. Sanity in your backlog and contribution process
    - Markdown-based todo system
    - Clear contribution guide

---

_My game, Dragon Quest Solitaire is still in progress. But [dragonsweeper](https://danielben.itch.io/dragonsweeper/)  by Daniel Ben is great, and you should check it out!_
