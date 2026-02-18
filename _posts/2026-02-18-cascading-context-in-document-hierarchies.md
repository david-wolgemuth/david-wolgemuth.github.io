---
layout: post
title: "Cascading Context in Document Hierarchies"
date: 2026-02-18
tags: [healthcare, architecture, design-patterns]
excerpt: "Healthcare data lives in nested document hierarchies. Understanding how context flows — and where it breaks — is the difference between a model that computes correctly and one that silently lies."
---

Healthcare data rarely lives in a single document. A fee schedule belongs to a contract. A contract belongs to a payer relationship. A claim belongs to a member. A member belongs to a plan. Every meaningful value in the system exists in the context of a hierarchy, and reading it correctly requires knowing how far up the tree to look.

This structure is not accidental — it reflects how the business actually works. But it creates a recurring modeling problem: **how does context propagate from parent documents to child records, and what happens when it doesn't?**

## The Cascading Mental Model

CSS is a useful analogy here, and not just superficially.

In CSS, properties cascade down the tree. A `font-family` set on `body` applies to every element unless something closer overrides it. Specificity determines which rule wins. The computed style of any element is the result of walking up the DOM and resolving conflicts.

Healthcare document hierarchies work similarly:

```
Payer Contract
└── Fee Schedule
    └── Rate (by procedure code)
        └── Allowed Amount (for a specific claim)
```

A rate might be specified explicitly at the fee schedule row level. Or it might be inherited from a contract-wide default. Or it might be computed from a formula defined at the payer level. The "effective" rate for any given claim is the result of resolving that chain — and if your code reads only from the leaf node, it may find nothing, or the wrong thing.

The failure mode is subtle: the leaf record *looks* complete. It has a value. But the value is stale, missing, or computed without the context that should have qualified it.

## Three Kinds of Values

This suggests a useful taxonomy. A value in a document hierarchy can be:

**Specified** — explicitly set at this level. A contract says: procedure code 99213 pays $85.00. That's specified. It lives at this node.

**Inherited** — not set at this level, but present in an ancestor. The contract doesn't specify a rate for 99214, but it has a default percentage of Medicare. The fee schedule inherits that policy and applies it.

**Detected** — not stored anywhere; computed on read from surrounding context. The allowed amount on a claim isn't a field you write to — it's derived by finding the matching rate and applying the contract logic at claim time.

Most data modeling treats all three as equivalent: put a value in a column. But they're not equivalent. They have different update semantics, different freshness guarantees, and different failure modes:

- **Specified values** go stale when contracts change and downstream records aren't updated.
- **Inherited values** break when the hierarchy is restructured and ancestors are reassigned.
- **Detected values** are always fresh but expensive — and they silently return wrong results when the detection logic doesn't match the real-world hierarchy.

Conflating them is how you end up with a billing system that passes all its tests and computes the wrong amounts in production.

## Where Context Leaks

The places context tends to break down:

**At import boundaries.** When data crosses a system boundary — a contract loaded from a payer portal, a claim submitted through an EDI parser — the hierarchy often gets flattened. The import captures the leaf values but drops the ancestor context. The downstream system sees the value but not the conditions under which it's valid.

**At denormalization points.** For performance reasons, systems often copy values from parent records into child records. This is fine until the parent changes and the copy doesn't. Now you have two sources of truth, and one of them is wrong. The system computes confidently and incorrectly.

**At version transitions.** Contracts are renegotiated. Fee schedules have effective dates. A rate that was correct last year isn't correct this year. If your model doesn't encode the effective date range at each level of the hierarchy, you're implicitly assuming the hierarchy is static — which it isn't.

**At abstraction layers.** The further from the raw data you get, the more likely someone has collapsed the hierarchy for convenience. An ORM model that looks up rates without surfacing the contract context it resolved them from is convenient until you need to understand why a claim was priced incorrectly. (The answer lives three layers up in a document the model doesn't know it consumed.)

## What Good Resolution Looks Like

A system that handles this well tends to have a few properties:

**Explicit resolution paths.** The code that looks up a rate should be auditable — it should be possible to trace exactly which level of the hierarchy provided the value, and which levels were consulted and passed through. This isn't just for debugging; it's a correctness requirement.

**Immutable snapshots.** When a claim is processed, the hierarchy state at that moment should be captured. Not a pointer to the current hierarchy (which may change), but a snapshot of what was true when the calculation ran. This makes retroactive auditing possible.

**Clear ownership of each value type.** If a value is specified, it should be clear which document owns it. If it's inherited, the code that resolves it should say so explicitly, not silently walk the tree. If it's detected, the detection logic should be a named function, not an inline calculation buried in a larger query.

These aren't novel ideas — they're standard data modeling discipline. They're notable mostly because healthcare systems so frequently ignore them, often because the hierarchy is complex enough that shortcuts feel justified, and the failures take years to surface.

## A Pattern Worth Naming

The underlying pattern: **don't denormalize context, resolve it**.

A denormalized system copies context into every leaf record so it doesn't have to traverse the tree. This is fast to read and fragile to update. A resolution-based system stores context at the right level of the hierarchy and computes the effective value when needed. This is slower to read and correct when the hierarchy changes.

The right tradeoff depends on access patterns and update frequency — but the important thing is to make the choice deliberately, not by accident. Most systems don't choose; they denormalize by default because it's easier to build, then spend years patching the inconsistencies that result.

Healthcare billing is particularly unforgiving here because the stakes of a wrong computation are real: incorrect payments, failed audits, contract violations. The hierarchy complexity isn't incidental — it's encoding actual business rules. Treating it as a lookup problem rather than a resolution problem is the source of a lot of otherwise-inexplicable bugs.

---

*Written with AI assistance and human editing.*
