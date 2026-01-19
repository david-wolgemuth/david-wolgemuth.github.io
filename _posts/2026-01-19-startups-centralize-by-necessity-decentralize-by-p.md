---
layout: post
title: "Startups centralize by necessity, decentralize by pain"
date: 2026-01-19
tags: [systems-thinking, architecture, startup]
excerpt: "Centralization isn't a mistake at 15 people — it's a survival strategy. Decentralization isn't an optimization — it's a response to bottlenecks."
---

## Problem Statement

Growing companies oscillate between centralization and decentralization. This isn't indecision or bad management — it's a predictable response to shifting constraints. Early centralization enables speed. Later centralization creates bottlenecks. The transition between them is typically painful.

## Context

At 10-15 people, centralization is often correct. One person owns the deployment process. One person approves PRs. One person decides the data model. Decisions are fast because coordination cost is nearly zero — everyone's in the same room, the same Slack channel, or at least the same mental model.

This works until it doesn't. The failure mode isn't "centralization is bad" — it's that centralization scales poorly. The central decision-maker becomes a queue. Work stalls waiting for approval, review, or context transfer. The person who "owns everything" becomes the bottleneck for everything.

At this point, teams decentralize — not because they planned to, but because the pain forces it.

## The Pattern

```
┌─────────────────────────────────────────────────────────────────┐
│  CENTRALIZED (early, fast)                                      │
│                                                                 │
│  • One person owns deployment                                   │
│  • One person approves schema changes                           │
│  • One person decides API contracts                             │
│  • Coordination cost: near zero                                 │
│  • Decision latency: minutes                                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    [ Team grows 2-3x ]
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  PAIN POINT (bottlenecks emerge)                                │
│                                                                 │
│  • Deployment queue: 3 PRs waiting on one reviewer              │
│  • Schema changes: 2-day wait for approval                      │
│  • API contracts: Design meetings blocked on one calendar       │
│  • Coordination cost: quadratic growth                          │
│  • Decision latency: days                                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    [ Forced decentralization ]
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  DECENTRALIZED (distributed ownership)                          │
│                                                                 │
│  • Multiple deployment owners per domain                        │
│  • Schema changes owned by domain teams                         │
│  • API contracts: design docs + async review                    │
│  • Coordination cost: higher per-decision                       │
│  • Decision latency: minutes again (parallel paths)             │
└─────────────────────────────────────────────────────────────────┘
```

## Examples

### The Implicit Registry

Terminal tabs often serve as an implicit registry of "what I'm working on." At 2-3 parallel tasks, this is fine — the overhead of explicit tracking exceeds the benefit. Close a tab, lose context, but it's recoverable because it fits in working memory.

At 6-8 parallel workstreams, this breaks down. Tabs accumulate. Context gets lost. The implicit approach stops working not because it was wrong initially, but because the scale changed.

The fix isn't to centralize harder (one master task list managed by one person). It's to make the implicit explicit — a registry that persists state, tracks metadata, and surfaces staleness. The centralized mental model becomes a distributed, queryable system.

### The Agent Hierarchy

When building systems to delegate work (to people or to AI agents), the tempting approach is centralized orchestration: one decision-maker that routes all work to specialists.

This mirrors early-startup centralization — and has the same failure mode. The orchestrator becomes a bottleneck. Every decision flows through it. Context gets lost in the handoffs.

The alternative isn't "no orchestration" — it's pushing decisions to the edges. Instead of one agent deciding "Should I proceed?", the rule becomes: trivial confirmations auto-approve, meaningful choices surface to the human. The orchestrator handles routing, not every decision.

### Structural Entropy

In a fast-moving codebase, new folders sprout when the moment demands it. `tasklist/`, `tasks/`, `docs/tasks/`. Three parallel structures emerge with overlapping intent.

This is centralization in disguise — the original author held the mental model of "where things go." When that model becomes implicit (stored in one person's head), structural entropy compounds. Finding things requires asking the one person who knows.

Decentralizing doesn't mean "everyone creates folders wherever they want." It means making the structure legible: documenting canonical locations, flagging duplicates, and establishing clear conventions. The central knowledge becomes shared infrastructure.

## Tradeoffs

| Factor | Centralized | Decentralized |
|--------|-------------|---------------|
| **Decision speed (early)** | Fast (one approval path) | Slow (coordination required) |
| **Decision speed (later)** | Slow (queue forms) | Fast (parallel paths) |
| **Consistency** | High (one decision-maker) | Varies (multiple interpretations) |
| **Bus factor** | High risk (single point of failure) | Lower risk (distributed knowledge) |
| **Overhead** | Low initially, high at scale | Higher initially, stable at scale |

The transition point varies by team. Common signals:
- PRs waiting 2+ days for one reviewer
- Decisions deferred to "the person who knows"
- Questions that only one person can answer
- Work blocked on one calendar

## Open Questions

The harder question isn't when to decentralize — the pain makes that obvious. The harder questions:

**What to centralize intentionally.** Some things benefit from central control even at scale: security review, data model changes that span domains, public API contracts. The skill is distinguishing "this needs coordination" from "this is just habit."

**How to preserve consistency.** Decentralization trades consistency for speed. Design docs, conventions, and shared infrastructure can recover some consistency — but not all. The question becomes: which inconsistencies are tolerable?

**When to re-centralize.** Sometimes decentralization overshoots. Multiple teams make incompatible decisions. The codebase fragments. Coordination cost rises differently than expected. Recognizing when to pull back is less obvious than the initial push outward.

---

The system behaves exactly as designed — just not as intended.

---

*This post was written with AI assistance.*
