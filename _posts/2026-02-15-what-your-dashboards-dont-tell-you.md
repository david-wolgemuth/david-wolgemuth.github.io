---
layout: post
title: "What your dashboards don't tell you"
date: 2026-02-15
tags: [systems-thinking, observability, startup]
excerpt: "Dashboards optimize for what's measurable, not what matters — and that gap is where the important failures hide."
---

## The Problem

Dashboards show what you instrumented. The critical failures happen in what you didn't.

API response time is tracked. Why users abandon the flow three clicks later isn't. Error rate per endpoint gets graphed. The pattern of which combinations of features fail together doesn't. Database query performance is monitored. Whether the right queries are even running goes unnoticed.

The dashboard shows a healthy system while users hit walls.

## What Gets Left Out

**Cross-system dependencies.** Service A and Service B both report green. The interaction between them — where B assumes A has already validated input — isn't instrumented. The failure surfaces as intermittent data corruption, not a spike in a metric.

**User intent.** You can see that checkout completions dropped 15%. You can't see that a new required field appeared in a different order on mobile, and users now abandon before reaching it. The funnel graph shows the symptom. The *why* lives in session replays no one watches systematically.

**Temporal patterns.** A metric spikes every Monday at 9am. Is it load? A batch job? A misconfigured cron? The dashboard shows *when*. It doesn't show *why* or *whether it's expected*.

**Silent degradation.** Response times inch up by 50ms per week. No threshold is breached. No alert fires. Six months later, the system is unusable, and no single commit is at fault. The trend line was in the dashboard. The implication wasn't.

**What didn't happen.** You track deploys. Do you track deploys that *should have happened* but didn't? Alerts that should have fired but were silenced? Scheduled jobs that exited early?

Dashboards are optimized for questions you already know to ask.

## The Instrumentation Trap

Adding more metrics doesn't solve this. It compounds it.

More metrics mean more cognitive load. Engineers stop pattern-matching across panels and start staring at individual graphs. The system-level view fragments into service-level snapshots.

The dashboard becomes a lagging indicator of legibility, not system health. If it's easy to graph, it gets graphed. If it requires joining three data sources and inferring intent, it doesn't.

**What gets measured:** request latency, error counts, resource utilization.

**What doesn't:** why the same user retries the same request eight times, why a feature that works in staging fails in prod only for enterprise customers, why deploys succeed but don't actually change behavior.

The dashboard is a mirror. It reflects what the system was designed to report, not what it's actually doing.

## Dashboards as Organizational Memory

Dashboards encode what was important *when they were built*. Priorities shift. The system evolves. The dashboard doesn't.

That panel tracking "API gateway timeouts" made sense when the gateway was the bottleneck. Now it's the downstream service. The panel still exists. Engineers still check it. It no longer correlates with user pain.

Dashboards become archaeology. Layers of metrics accumulate. No one removes the obsolete ones because "someone might need it." The cognitive cost of filtering the irrelevant exceeds the value of the relevant.

At a 100-person company, the dashboard might have panels from when the team was 10. The system is unrecognizable. The dashboard still shows request counts by legacy service names.

Inertia is easier than curation.

## What Actually Surfaces Issues

**The person who gets paged at 2am.** They know which graph *combinations* indicate real problems. They know the metric that never appears in dashboards but always predicts outages. They correlate three unrelated symptoms because they've seen it before.

This knowledge doesn't export to a dashboard. It lives in pattern recognition accumulated over months of incidents.

**Engineers who regularly work in the code.** They notice when a service *should* have logged something but didn't. They spot the absence of an expected metric. They know when "success rate: 100%" actually means "no traffic."

**User-facing teams.** Support sees the complaints before the metrics spike. Sales hears "it feels slower" weeks before monitoring confirms degradation. Product sees feature adoption stall before the engagement dashboard reflects it.

The dashboard is a lagging, filtered snapshot. The humans are the sensor array.

## Working Around the Limits

**Structured anomaly review.** Don't wait for dashboards to tell you something's wrong. Periodically ask: "What *should* be happening that isn't?" Review silent systems. Verify expected failures still occur (e.g., rate-limiting logs, expected validation errors).

**Instrumentation for questions, not just answers.** Add trace IDs that let you reconstruct user flows. Log decision points, not just outcomes. Track "why this code path was taken," not just "this code path executed."

**Link metrics to user impact.** A spike in database retries might be invisible to users or catastrophic. Tag metrics with user-facing context: "retry with fallback" vs. "retry and fail."

**Runbooks that reference what's missing.** "If X metric is elevated, check Y manually — it's not instrumented but correlates." Encode the human knowledge that doesn't fit in a panel.

**Incident retros that update dashboards.** Every postmortem should ask: "What *should* have been on a dashboard but wasn't?" Add it. Then ask: "What was on the dashboard but irrelevant?" Remove it.

Dashboards are tools, not truth. They make visible what you decided to measure. The gaps are structural, not accidental.

The system you operate is not the system you observe.

---

*This post was drafted with assistance from Claude (Anthropic). I've edited it for accuracy, style, and to reflect actual principles from working systems.*
