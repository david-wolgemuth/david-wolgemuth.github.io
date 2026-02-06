---
layout: post
title: "The 80% problem — why work gets stuck near done"
date: 2026-02-06
tags: [systems-thinking, startup, complexity]
excerpt: "Most unfinished work isn't blocked at the start. It stalls near the end, where the remaining effort is invisible, coordination-heavy, and easy to deprioritize."
---

## The Shape of Unfinished Work

There's a category of work that's worse than not-started: almost-done.

A branch with passing tests but no PR. A PR approved but never merged. A feature shipped but never announced to stakeholders. A refactor prototyped in a worktree that hasn't seen a commit in three weeks.

These items share a pattern: the hard, visible work is complete. What remains is small, ambiguous, and easy to skip — so it gets skipped, sometimes indefinitely.

The result is a growing pile of 80%-done work that represents real effort but delivers zero value. The code is written. The tests pass. But the thing never ships.

## Why the Last 20% Is Different

The first 80% of a task tends to be *legible*. Write the code, make the tests pass, get the review. Each step has a clear output and a natural next action. Progress is visible and measurable.

The last 20% is structurally different. It's often a mix of:

- **Coordination overhead.** Following up with the design team. Pinging the person who needs to approve. Writing the migration guide for downstream consumers. These aren't hard tasks, but they require context-switching to someone else's schedule.

- **Ambiguous scope.** "Just needs cleanup" or "one more edge case." The remaining work isn't well-defined enough to estimate, so it's hard to prioritize against work that *is* well-defined. And since it's "almost done," it doesn't feel urgent enough to block out time for.

- **Diminishing feedback signal.** The first 80% generates clear feedback: tests pass, the feature works, the reviewer approves. The last 20% — documentation, announcements, integration testing — produces feedback that's diffuse and delayed. There's no green checkmark for "stakeholders were informed."

The asymmetry is structural. Starting work generates momentum. Finishing work generates friction.

## The Invisible Inventory

In manufacturing, work-in-progress (WIP) inventory is a well-understood cost. Parts sitting on the factory floor tie up capital, take up space, and risk becoming obsolete before they're assembled into something sellable. Lean manufacturing treats WIP reduction as a primary optimization target.

Software has an equivalent, but it's less visible. Stale branches are inventory. Draft PRs are inventory. That feature you shipped but never documented — the documentation gap is inventory.

```
Visible work tracker (Jira, Linear, etc.):
  ✓ AUTH-1234: JWT refactor        [Done]
  ✓ AUTH-1240: Token refresh        [Done]

Invisible inventory (no system tracks this):
  • JWT refactor branch — merged, but no migration guide written
  • Token refresh — shipped, but API consumers not notified
  • Auth cleanup — tests pass, PR never opened
  • Session timeout fix — prototyped, not productionized
```

The visible system says the work is done. The invisible inventory says otherwise. The gap between the two is where credibility erodes and follow-up costs accumulate.

## What Makes It Compound

Unfinished work doesn't just sit there. It compounds in two ways.

**Context decay.** The longer a task stays at 80%, the more expensive the remaining 20% becomes. You forget why you made certain decisions. The codebase evolves around the stale branch. The person you needed feedback from has moved on to other priorities. What was a 30-minute task two weeks ago is now a half-day investigation.

**Opportunity cost of ambiguity.** An 80%-done task occupies a strange middle ground. It's not done enough to close, not blocked enough to escalate, not abandoned enough to delete. So it lingers in some mental or digital queue, consuming a small amount of attention every time you scan your open work — without ever reaching the threshold where you actually do something about it.

(This is, in some sense, the worst possible state for a task to be in. At least a clearly blocked task generates an actionable next step.)

## The Detection Problem

Most tracking systems are optimized for the front of the pipeline: what's queued, what's in progress, what's blocked. Fewer are designed to detect the slow stall of nearly-complete work.

Some heuristics that indicate 80%-done items:

| Signal | What it suggests |
|--------|-----------------|
| Branch exists >7 days, no PR | Code written, never submitted |
| PR approved >2 days, not merged | Review passed, follow-through stalled |
| PR merged, no announcement | Feature shipped invisibly |
| Worktree with no commits in 14+ days | Work started, then abandoned |

These are all detectable from git and GitHub metadata alone. The information exists — it just isn't surfaced by default.

## What Helps

The 80% problem isn't solved by working harder on finishing things. (If willpower were sufficient, the work would already be done.) It's addressed by making the invisible inventory visible and reducing the friction of the final steps.

**Surface stale work explicitly.** If your system can detect branches, PRs, and worktrees that match the patterns above, surface them. A daily or weekly list of "things that are almost done" creates a forcing function that periodic scanning of your backlog doesn't.

**Make the next action concrete.** "Finish the auth refactor" is not actionable. "Open the PR for the auth refactor branch" is. The 80%-done state persists partly because the remaining work isn't decomposed — breaking it into one specific step reduces the activation energy.

**Treat completion as a distinct phase.** Starting work and finishing work require different modes. Starting is generative — you're building something new. Finishing is administrative — you're handling coordination, documentation, communication. Mixing them in the same work block tends to favor the generative mode, because it feels more productive. Allocating explicit time for the completion phase — even just 30 minutes — acknowledges that finishing is real work, not just overhead.

**Set staleness thresholds.** An item that's been 80%-done for two weeks should trigger a binary decision: finish it or archive it. The middle state is the expensive one. Either option is better than continued limbo.

## The Uncomfortable Part

A nontrivial amount of 80%-done work probably should be abandoned rather than finished. The refactor that seemed important three weeks ago may no longer be relevant. The prototype that "just needs productionization" might not justify the integration effort.

Abandonment feels like waste — you already put in the work. But the sunk cost is already spent. The remaining question is whether the *additional* effort of finishing produces enough value to justify itself, independent of what came before.

Sometimes the honest answer is no. Archiving an 80%-done item isn't failure. Letting it linger indefinitely is.

---

*Written with AI assistance and human editing.*
