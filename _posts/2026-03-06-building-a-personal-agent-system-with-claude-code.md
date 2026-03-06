---
layout: post
title: "Building a Personal Agent System with Claude Code"
date: 2026-03-06
tags: [architecture, python, trends]
excerpt: "What it actually takes to build a personal orchestration layer on top of Claude Code — the patterns that hold and the ones that don't."
---

Most personal automation projects die at the "cool demo" phase. You wire up a few API calls, it works once, and then you stop trusting it enough to actually delegate to it.

Here's what tends to keep a personal agent system alive: treating it like infrastructure, not a script.

## The Core Problem with Agent Scripts

A script does one thing. An agent needs to do *your* thing, which changes. It needs context about what you're doing, what you care about, and what you've already tried. Scripts don't carry that. A system can.

The usual failure mode is building a collection of standalone scripts that don't share state. Each one works in isolation. None of them know about each other. You end up re-running things, losing context, and debugging in the dark.

The fix is a thin orchestration layer that:
- Routes tasks to the right tool
- Passes context between steps
- Records what happened
- Surfaces failures clearly

This isn't a novel architecture. It's what every microservice platform does. The difference is you're the only user, so the failure feedback is immediate and personal.

## The Architecture That Tends to Hold

```
┌─────────────────────────────────────────┐
│              Orchestrator               │
│   (routes, schedules, tracks state)     │
└──────────────────┬──────────────────────┘
                   │
        ┌──────────┼──────────┐
        ▼          ▼          ▼
   ┌─────────┐ ┌──────┐ ┌──────────┐
   │  Tools  │ │ Git  │ │ External │
   │   CLI   │ │ log  │ │  APIs    │
   └─────────┘ └──────┘ └──────────┘
```

The orchestrator isn't smart. It doesn't need to be. Its job is to receive intent, pick a tool, pass context, and return results. The intelligence lives in the tools and (when delegated) in the model.

The tools CLI is the key piece most systems skip. Instead of calling an API directly, every external action goes through a named tool with a typed interface. This gives you:

- **Consistent logging** — you can audit what happened
- **Permission boundaries** — some tools auto-execute, others prompt
- **Testability** — you can run tools without the model involved

The git log as state journal is a small pattern with outsized value. Every meaningful agent action that modifies state ends in a commit. History becomes legible without a database.

## What Claude Code Changes

Claude Code isn't a chatbot interface — it's a programmable agent runtime. It can read files, run tools, branch on results, and write back. That changes the architecture in two ways.

First, you stop writing prompt templates and start writing tool contracts. The model doesn't need to know *how* to do something; it needs to know *what tool to call* and what the output will look like.

Second, you get agent composition for free. A high-level orchestrator delegates to a sub-agent that has a narrow context window and a specific tool set. The sub-agent finishes and hands back a result. No shared mutable state. No coordination overhead.

This maps cleanly to how you'd design it with humans: give each person a clear scope, defined inputs, and defined outputs. Don't let them call each other's functions.

## The Patterns That Break

**Polling agents beat event-driven** for personal productivity. Not always — but often enough that starting with polling is almost always right. Event-driven sounds cleaner but introduces reliability assumptions (what happens when the event source goes down while you're asleep?). A polling agent that checks state every 30 seconds is easy to reason about and easy to restart.

**Context windows are not infinite.** This seems obvious until you've built a system that tries to pass an entire project's file tree to a model. Agents that work well tend to pass *summaries*, not raw content. The orchestrator is responsible for knowing what to include.

**Failure modes need names.** An agent that fails silently is worse than one that doesn't run at all. Every tool should return a structured result: `success`, `failure`, `blocked`. The orchestrator logs it. You can grep for it later.

## The Honest Tradeoff

A personal agent system built on Claude Code is genuinely useful. It's also a system you have to maintain, debug, and occasionally distrust.

The distrust is the hard part. A tool that works 95% of the time but occasionally does something unexpected is worse than a tool that works 80% of the time reliably. Reliability is more important than capability for systems you're delegating to.

The way to build trust: start with read-only tools. Let the agent observe and report before it acts. Promote tools to auto-execute only when you've seen them handle edge cases correctly. This isn't caution — it's how you build a system you'll actually use.

---

*This post was written with AI assistance as part of exploring the patterns described here.*
