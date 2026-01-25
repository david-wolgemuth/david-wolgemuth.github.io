---
layout: post
title: "Coworking with AI: Lessons from Daily-Driving Cursor and Claude"
date: 2026-01-25
tags: [trends, systems-thinking, startup]
excerpt: "AI coding tools create a new coordination problem: you're now managing delegated work, not just writing code."
---

The shift from "AI writes snippets" to "AI writes features" changes the nature of the work. You're not typing faster. You're supervising.

This distinction matters. The failure modes are different. The skills are different. And the tooling gap is real.

## The Verification Gap

When you write code, you understand it because you were there. You know the trade-offs, the edge cases, the shortcuts you took.

When an agent writes code, you face a new problem: verifying delegated work.

```
Traditional:    You write → You know what changed → You ship
Delegated:      Agent writes → You don't know what changed → ???
```

Reading every line defeats the purpose. Shipping blind is reckless. This is a coordination problem that surfaces immediately once AI tools handle substantial chunks of work.

The naive assumption is that tests are sufficient. They're not. Tests verify behavior, not intent. They don't tell you whether the agent addressed four of five acceptance criteria, or introduced a subtle architectural regression, or solved the wrong problem entirely.

## Context Loss at Scale

Running multiple AI sessions in parallel (and you will, once you trust them enough) creates a supervision problem.

Each session:
- May be waiting for input
- May have finished without you noticing
- May be making conflicting changes to the same file
- May be stuck on something it won't explicitly surface

Terminal tabs become an implicit registry of work-in-progress. Close a tab, lose context. Forget to check a session, waste time. There's no single pane of glass that shows "what are all my agents doing right now?"

This isn't hypothetical. It's the day-one problem when you move from occasional AI assist to AI-as-primary-author.

## Autonomy Calibration

Not every AI decision should require human approval. Not every decision should be autonomous.

The calibration question: what can the agent auto-handle versus what should it surface?

| Situation | Reasonable Default |
|-----------|-------------------|
| "Should I proceed?" (trivial confirmation) | Auto-yes |
| "Approach A or B?" (judgment call) | Surface |
| CI failing on flaky test | Auto-retry (up to N times) |
| CI failing on real failure | Surface |
| Session idle for 30 minutes | Check status, surface if stuck |

This calibration is implicit in how you use AI tools today. Making it explicit—deciding upfront what autonomy level each situation warrants—reduces the cognitive overhead of constant check-ins.

The alternative is polling every session manually, which scales poorly.

## The "Push Everything" Pattern

One pattern that emerges: treat git as the source of truth, not terminal state.

When an agent makes changes, push immediately. This:
- Creates an audit trail
- Moves diffs to GitHub's superior UI
- Triggers CI immediately
- Makes review asynchronous rather than synchronous with the session

The terminal is ephemeral. The git history is durable. Orienting around the durable artifact simplifies the verification workflow.

## QA as a First-Class Concern

Verification of delegated work needs tooling.

Three artifacts that help:

**Change summaries**: High-level descriptions of what changed, in human terms. Not a diff—an explanation.

**QA checklists**: Actionable verification steps derived from acceptance criteria. What to test, how to test it, where to look.

**Completion assessments**: Did the agent actually finish? Addressed 4 of 5 criteria? Left something half-done?

These can be generated (Claude reading the diff and the ticket), but the point is: the workflow needs explicit verification steps. "Look at the diff and eyeball it" doesn't scale.

## The Supervision Stack

As AI coding tools mature, the bottleneck shifts. It's no longer "how do I get the AI to write code?" It's:

- How do I track what's happening across multiple sessions?
- How do I verify work I didn't write?
- How do I maintain context that survives session boundaries?
- How do I calibrate autonomy appropriately?

These are orchestration problems. The tools for solving them are nascent.

What exists today: terminal tabs, git branches, manual polling. What's needed: explicit registries of work-in-progress, automatic staleness detection, unified supervision views, generated verification artifacts.

The irony is that this is exactly the kind of coordination problem AI tools could help solve—supervising AI-written code using AI-generated verification. But the loop isn't closed yet.

## Practical Implications

For teams adopting AI coding tools:

**Expect the verification bottleneck.** Code generation is now cheap. Code verification is the constraint.

**Make work-in-progress explicit.** Don't rely on terminal tabs or mental models. Track active workstreams somewhere durable.

**Push early, review on GitHub.** Terminal diffs are hard to parse. GitHub's UI is better. Use it.

**Invest in QA tooling.** Checklists, summaries, completion assessments—whatever makes verification systematic rather than ad-hoc.

**Calibrate autonomy deliberately.** Decide upfront what the agent can auto-handle. Otherwise you'll over-supervise or under-supervise.

---

The shift to AI-as-coworker isn't just about productivity. It's about changing what kind of work you do. Less typing, more supervising. Less authoring, more verifying.

The tools will improve. But the underlying coordination problem—managing delegated work—is durable. It's worth getting good at now.

---

*This post was written with AI assistance.*
