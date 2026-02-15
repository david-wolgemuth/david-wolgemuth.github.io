---
layout: post
title: "Trigger-based vs. view-based accumulation"
date: 2026-02-05
tags: architecture healthcare
excerpt: "Two approaches to maintaining derived state: accumulate on write, or compute on read."
---

You need to track something that changes over time. A patient's total out-of-pocket spending. A document's staleness score. How many items in a queue match certain criteria.

The question isn't *whether* to track it — it's *when* to compute it.

## Two Approaches

**Trigger-based accumulation** updates derived state when the underlying data changes. A database trigger increments a counter when a row is inserted. A webhook updates a cache when a file changes. The answer is pre-computed and ready to read.

**View-based accumulation** computes derived state when someone asks for it. A SQL view sums claims at query time. A function scans a directory to count files. The answer is always fresh, computed on demand.

Neither is universally better. The choice depends on how often you write, how often you read, how expensive the computation is, and how stale your answer can be.

## Healthcare Example: Accumulator Tracking

In healthcare billing, accumulators track how much a patient has spent toward their deductible or out-of-pocket maximum. When a claim processes, the system needs the current accumulated total to determine what the patient owes.

Trigger-based: Each claim updates the accumulator as it processes. The total is always current.

```python
# Trigger-based
def process_claim(claim, patient):
    patient.accumulator += claim.patient_responsibility
    patient.save()
```

View-based: Query all claims for the patient and sum them.

```python
# View-based
def get_accumulator(patient_id):
    return Claim.objects.filter(
        patient_id=patient_id,
        status='processed'
    ).aggregate(total=Sum('patient_responsibility'))['total']
```

At first glance, trigger-based seems obviously better — faster reads, constant-time lookup. But healthcare data has a complication: claims get adjusted, reversed, reprocessed. An accumulator that was correct yesterday might be wrong today because a claim from last month was retroactively repriced.

The view-based approach handles this naturally — it always reflects current truth. The trigger-based approach requires careful handling of adjustments: when a claim is modified, you need to reverse the old contribution and add the new one. Miss an edge case and your accumulator drifts from reality.

## Staleness Detection

Consider tracking which items in a system have become stale — worktrees not touched in 14 days, tasks lingering at 80% completion, promises made but not kept.

Trigger-based would update a "last_touched" timestamp on every action, then scan for stale items when needed:

```python
# Accumulate timestamps on each action
def touch_workstream(workstream):
    workstream.last_touched = now()
    workstream.save()

# Check staleness by comparing timestamps
def get_stale_items(threshold_days=14):
    cutoff = now() - timedelta(days=threshold_days)
    return Workstream.objects.filter(last_touched__lt=cutoff)
```

View-based would infer staleness from the source data directly — last commit timestamp from git, last message timestamp from a thread, file modification time from the filesystem:

```python
# No accumulated state — compute from source
def get_stale_worktrees(threshold_days=14):
    cutoff = now() - timedelta(days=threshold_days)
    stale = []
    for wt in worktrees():
        last_commit = git_last_commit_time(wt.path)
        if last_commit < cutoff:
            stale.append(wt)
    return stale
```

The view-based version is slower (many git calls) but has no drift risk. The trigger-based version is faster but requires discipline: every code path that "touches" a workstream must remember to update the timestamp. Miss one, and your staleness detector lies.

## When Trigger-Based Wins

Trigger-based accumulation tends to win when:

- **Reads vastly outnumber writes.** A counter queried thousands of times per second but updated once per minute.
- **Computation is expensive.** Aggregating millions of records is too slow to do on every read.
- **Source data is append-only.** No adjustments, no corrections, no retroactive changes.
- **Staleness tolerance is high.** A dashboard that can be 5 minutes behind is fine with eventual consistency.

## When View-Based Wins

View-based computation tends to win when:

- **Underlying data changes in complex ways.** Adjustments, reversals, corrections, retroactive modifications.
- **Correctness trumps performance.** Billing, compliance, anything where "the number is wrong" is worse than "the number is slow."
- **Computation is cheap enough.** Modern databases can aggregate surprisingly fast, especially with good indexes.
- **You can't trust all code paths to update.** Missing a trigger point means silent drift. Views can't drift.

## Hybrid: Cached Views

A common middle ground: compute on read, but cache the result. The cache is a trigger-based accumulation with a twist — instead of maintaining correctness on every write, you invalidate on write and recompute on the next read.

```python
def get_accumulator(patient_id):
    key = f"accumulator:{patient_id}"
    cached = cache.get(key)
    if cached is not None:
        return cached

    total = compute_accumulator(patient_id)  # Expensive view
    cache.set(key, total, ttl=300)
    return total

def invalidate_accumulator(patient_id):
    cache.delete(f"accumulator:{patient_id}")
```

This gives fast reads when the cache is warm, correctness when data changes (via invalidation), and automatic recovery from missed invalidations (via TTL expiry). The tradeoff is cache miss latency and the operational complexity of cache management.

## The Drift Problem

The core risk of trigger-based accumulation is drift: accumulated state that no longer matches what the source data would produce if you recomputed from scratch.

Drift happens when:
- A code path modifies source data without updating the accumulator
- A bug in the trigger logic calculates the wrong delta
- Source data is modified directly (database migration, manual fix, bulk import)
- The definition of what counts changes but historical data isn't reprocessed

If drift is catastrophic (wrong billing amounts, incorrect compliance status), view-based is safer. If drift is annoying but tolerable (dashboard slightly off until next recompute), trigger-based may be fine.

A defensive pattern: periodically recompute from source and compare against the accumulated value. Alert if they diverge. This turns invisible drift into visible drift — not ideal, but better than silently wrong.

---

*This post was written with AI assistance.*
