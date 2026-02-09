---
layout: post
title: "Startups centralize by necessity, decentralize by pain"
date: 2026-02-09
tags: [systems-thinking, architecture, startup]
excerpt: "Centralization isn't a design mistake. It's what works — until the queue behind it gets longer than the work itself."
---

## Why Everything Starts Centralized

At ten engineers, centralization isn't a choice. It's the default because anything else would be overhead nobody can afford.

One database. One deploy pipeline. One person who knows how the billing system works. One Slack channel where all technical decisions happen. This is efficient in the most literal sense: minimal coordination cost, maximal shared context, fast decisions.

The cost structure is real. Abstractions cost maintenance. Service boundaries cost integration work. Ownership models cost meetings. When the team is small enough that everyone attends the same standup, these costs outweigh their benefits.

So the system centralizes. Not because someone drew an architecture diagram that way, but because every other option requires effort that could be spent shipping.

## The Queue Nobody Notices

The transition doesn't announce itself. There's no moment where centralization "breaks." Instead, work starts queuing.

Pull requests wait because one person owns the subsystem. Decisions stall because the context needed to make them lives in someone's head. Tests slow down because every service hits the same database. Deploys block because a shared pipeline serializes what could be parallel.

Each of these is individually minor. The PR waits a day — not a crisis. The deploy takes an extra hour — manageable. But the pattern compounds. What used to be implicit coordination — "just ask Sarah" — becomes a serial bottleneck. Sarah is now a queue, not a person.

This is the signature failure mode: the system still functions, but throughput degrades not because the work is harder, but because it's *owned*.

## What Actually Forces the Change

Decentralization rarely happens because someone reads a book about microservices. It happens because the pain of the current system exceeds the cost of changing it.

Common triggers:

- **Hiring.** New engineers can't hold the full system in their heads. Implicit boundaries need to become explicit ones, or onboarding becomes a months-long oral tradition.
- **Parallel workstreams.** Two teams need to ship features that touch the same code. Without boundaries, they serialize. With boundaries, they can move independently — at the cost of defining what those boundaries are.
- **Compliance and reliability.** The database that was fine for one team's read patterns becomes a liability when three teams have different SLAs. The deploy pipeline that was fast enough for weekly releases can't support daily ones across multiple services.

None of these are architectural insights. They're organizational pressures. The decentralization isn't motivated by elegance — it's motivated by the fact that the current arrangement is actively slowing people down.

## The Uncomfortable Middle

The hardest part isn't the before or the after. It's the transition, where parts of the system are centralized and parts aren't.

During this period:

- Some teams own their deploys; others share a pipeline
- Some data has clear ownership; some is queried by everyone
- Some decisions are local; some still require cross-team consensus

This creates a kind of organizational ambiguity that's genuinely difficult to manage. People don't know which model applies to their situation. "Can I just change this, or do I need to ask?" becomes a recurring question with no consistent answer.

The temptation is to resolve this by picking a side — either re-centralize everything or decentralize aggressively. Both are expensive and usually wrong. The practical answer is to tolerate the inconsistency and decentralize incrementally, starting with the highest-pain bottlenecks.

(This is also where Conway's Law stops being a fun observation and starts being a daily reality. The code structure will mirror the team structure whether you want it to or not. Might as well be intentional about it.)

## What Decentralization Actually Costs

Decentralization trades one set of problems for another:

- **Consistency becomes work.** Centralized systems are consistent by default. Distributed ones require explicit effort — shared libraries, contracts, standards — to avoid drift.
- **Visibility decreases.** When everything runs through one pipeline, you can see everything. When teams own their own infrastructure, the full picture requires instrumentation that didn't used to be necessary.
- **Decisions you wouldn't have made.** Other teams will make technical choices you disagree with. This is a feature, not a bug, but it doesn't feel like one.

The cost doesn't disappear. It migrates from "things are slow because they're centralized" to "things are inconsistent because they're not." The question is which cost the organization can better absorb at its current size.

## The Pattern

Most startups trace the same arc:

1. Centralize because it's cheaper
2. Grow until the center becomes a bottleneck
3. Decentralize the painful parts, reluctantly
4. Discover new coordination costs
5. Repeat at a different scale

This isn't a failure of planning. It's a property of systems under growth. The optimal structure at 20 people isn't optimal at 80, and the optimal structure at 80 isn't optimal at 200. The skill isn't picking the "right" architecture — it's recognizing when the current one has outlived its constraints.

The signals are usually mundane: work waiting not because it's hard but because it's queued, decisions delayed to preserve a consistency that no longer matters, increasing effort spent maintaining the center rather than delivering through it.

At that point, decentralization isn't a strategy. It's an admission that the system has changed.

---

*Written with AI assistance and human editing.*
