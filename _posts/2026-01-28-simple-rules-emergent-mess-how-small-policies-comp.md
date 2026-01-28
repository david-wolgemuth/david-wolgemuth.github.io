---
layout: post
title: "Simple rules, emergent mess: how small policies compound"
date: 2026-01-28
tags: [systems-thinking, complexity, startup]
excerpt: "Each rule makes sense in isolation. Together, they create the chaos you're living in."
---

You didn't design your system to be this complicated. Nobody sat down and said "let's make onboarding take six approvals." It just... became that way.

The thing about small, sensible policies is that they interact. Each one has a clear justification. Together, they produce emergent behavior that nobody intended and everybody hates.

## The anatomy of compounding rules

A simple example from codebase organization:

1. **Rule A:** "Put tests next to the code they test." (Reasonable—makes test discovery easier.)
2. **Rule B:** "Keep a central `tests/` directory for integration tests." (Also reasonable—integration tests span modules.)
3. **Rule C:** "Task-related files go in `tasks/`." (Sure—separate concerns.)

Three years later, you have:
- `tests/`
- `src/module/tests/`
- `tasks/tests/`
- `task-alignment-tests/`
- `docs/tasks/`

Each directory made sense when created. Together, they form a structure nobody can navigate without `find`.

The entropy isn't a decision. It's an emergent property of rules that don't account for each other.

## Where this surfaces in practice

**Terminal tabs as state management.** Implicit rule: each workstream gets a tab. Implicit rule: don't close tabs with uncommitted work. Implicit rule: tabs are cheap, disk is cheap. Result: 47 open tabs, eight of which contain stale work from two sprints ago, and no way to query "what am I working on?"

**Follow-up fragmentation.** Promise to help a colleague. Note it in Slack. Put a TODO in your task list. Create a draft email reminder. Each mechanism is sensible. Together, you're now managing four partial tracking systems, checking none of them reliably.

**Approval accumulation.** Security requires sign-off on infrastructure changes. Compliance requires sign-off on data access patterns. Engineering requires sign-off on API changes. Each gate protects something real. Together, a straightforward feature now routes through three review tracks with different SLAs, different priorities, and no shared context.

## The second-order effects

The mess isn't the worst part. The second-order effects are:

**1. Workarounds proliferate.** People create shadow systems to cope. Personal spreadsheets tracking what's blocked. Private Slack channels for "fast-track" approvals. The official process becomes a formality you route around.

**2. Onboarding becomes archaeology.** New team members can't understand the structure by reading it. They have to ask, repeatedly, "why is this here?" The answer is usually "it made sense at the time."

**3. Maintenance cost distributes invisibly.** Nobody owns the complexity. Each rule has an owner who defends it. The *interaction* between rules has no owner. The distributed cost is borne by everyone navigating the system.

**4. Change becomes expensive.** Touching the structure risks breaking one of the implicit dependencies. Safer to add another folder than to consolidate. The mess compounds.

## The structural solution

The problem isn't rules. It's that rules don't compose well by default—and nobody's job is to watch them interact.

Some patterns that help:

**Explicit home declarations.** Instead of "tests go near the code they test," you might say "tests live in exactly one place: `tests/`. No exceptions." The rule becomes load-bearing. Deviations are bugs, not judgment calls.

**Regular structure audits.** Not automated cleanup (which tends to break things), but scheduled reviews asking: "Do we still need this? Does this duplicate something else? Could these merge?" Structure drift is natural; periodic inspection catches it before it compounds.

**Visible cost allocation.** When proposing a new rule, require answering: "What existing rules does this interact with?" Not to block the rule, but to surface the interactions upfront. The question itself changes the conversation.

## The limits of prevention

You won't eliminate emergent mess. Systems grow, priorities shift, and some temporary solutions become permanent fixtures. That's fine.

The goal isn't zero entropy. It's recognizing when the mess is no longer serving the rules—when people spend more effort navigating structure than doing work. That's the signal to consolidate.

The rules themselves probably still make sense. The question is whether their combined behavior does.

---

*This post was written with AI assistance.*
