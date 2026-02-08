---
layout: post
title: "The Spec-Driven Development Pattern: Design Docs as Contracts"
date: 2026-02-08
tags: [architecture, startup, design-patterns]
excerpt: "When the document that describes what to build becomes the thing that enforces how to build it."
---

Most design docs die on arrival. They get written, reviewed, approved, and then promptly ignored as the real work begins. The code diverges from the document within days, and the document becomes a historical artifact — interesting but unreliable.

The spec-driven development pattern treats design docs differently. Instead of writing a document *about* the system, you write a document that *is* the system's contract. The spec doesn't describe what will happen. It constrains what *can* happen.

## The Problem with Descriptive Docs

A typical design doc reads like a narrative:

```markdown
## Overview
The auth system will migrate from session-based to JWT authentication.
API clients will need to update their headers.

## Approach
We'll create a new middleware that validates JWT tokens...
```

This is fine for communicating intent. But it has no teeth. Nothing connects this document to the code that gets written. When the implementation inevitably diverges — maybe the middleware becomes a decorator, maybe the header format changes — the doc doesn't complain. It just sits there, quietly becoming wrong.

## Specs as Behavioral Contracts

A spec-driven doc encodes boundaries, not just intentions:

```markdown
## Behavioral Contract

Does:
- Validates JWT tokens on every request
- Returns 401 with `{"error": "token_expired"}` on expiry
- Passes decoded payload to downstream handlers

Does NOT:
- Issue tokens (that's the auth service)
- Cache validation results
- Fall back to session auth
```

The shift is subtle but structural. "Does / Does NOT" creates a testable surface. When someone asks "should this component cache tokens?" — the spec answers. When a code reviewer sees caching logic in the middleware, the spec gives them grounds to push back.

This pattern tends to surface naturally in systems where multiple people (or agents) need to work on related components without stepping on each other. The spec becomes a coordination mechanism — not because anyone planned it that way, but because the alternative is constant Slack threads asking "wait, does your thing handle X or does mine?"

## What Makes a Good Spec

The useful parts of a spec tend to be:

**1. Boundaries over descriptions.** What this component *doesn't* do matters more than what it does. Descriptions are redundant with the code. Boundaries are not.

**2. Concrete examples over abstract rules.** "Handles errors gracefully" means nothing. "Returns `{"error": "rate_limit", "retry_after": 30}` on 429" means something you can test.

**3. Acceptance criteria that actually constrain.** "The system should be fast" is not a criterion. "P95 latency under 200ms for cached lookups" is a criterion that will survive contact with a PR reviewer.

A minimal spec might look like:

```yaml
component: rate-lookup-cache
owner: platform-team

does:
  - Cache rate lookups for 15 minutes
  - Invalidate on contract update events
  - Return stale data with warning header on cache miss + upstream timeout

does_not:
  - Cache error responses
  - Handle authentication
  - Transform rate data (returns upstream format verbatim)

acceptance_criteria:
  - Cache hit returns in <5ms
  - Cache miss falls through to upstream with 2s timeout
  - Stale data includes X-Cache-Stale: true header
```

This is about 20 lines. It took maybe 10 minutes to write. And it will save hours of "wait, should the cache transform the data?" conversations over the next month.

## Where This Breaks Down

Spec-driven development has a failure mode: premature specification. Writing a detailed behavioral contract before you understand the problem is worse than writing no spec at all, because now you have a wrong document with authority.

The pattern works best when:

- **The boundaries are known** — you've built one version already, or the domain is well-understood
- **Multiple contributors touch the same surface** — the coordination cost justifies the overhead
- **The component is a dependency** — downstream consumers need a stable contract

It works poorly when:

- **You're still exploring** — the spec will change faster than you can update it
- **It's a solo project** — the coordination overhead isn't worth it (you're coordinating with yourself, and you already know what you think)
- **The component is internal and small** — a function docstring is a sufficient contract

(Admittedly, there's a grey zone. Personal tooling that grows to coordinate multiple agents — even if it's technically a "solo project" — starts needing specs the moment the system has components that could reasonably misunderstand each other.)

## The Spec as Living Artifact

The trick that makes spec-driven development sustainable is treating the spec as the thing you update *first*. Not the code, not the tests — the spec.

```
1. Requirement changes
2. Update the spec (what changed, what didn't)
3. Update the code to match
4. Tests verify the code matches the spec
```

This inverts the typical flow where code changes propagate backward into documentation (if they propagate at all). The spec stays ahead of the implementation rather than chasing it.

In practice, this means the spec file lives next to the code — not in Confluence, not in a shared drive, not in a wiki that requires a separate login. If it's not in the repo, it's not real.

```
src/
  rate_cache/
    SPEC.md          # ← lives here, not in Confluence
    __init__.py
    cache.py
    tests/
```

## The Compound Effect

Individual specs are useful but unremarkable. The compound effect is what matters.

When every component has a behavioral contract, a new contributor can understand the system by reading specs alone — without running the code, without asking the original author, without reverse-engineering intent from implementation details. The specs *are* the architecture documentation, generated as a side effect of doing the work.

This also changes code review. Instead of "does this implementation seem right?" the question becomes "does this implementation match the spec?" — which is a much easier question to answer, especially under time pressure.

None of this requires a framework or special tooling. It's a markdown file with a convention. The constraint is cultural, not technical: someone has to care enough to keep the spec current. In teams that do, the pattern compounds. In teams that don't, the specs rot like any other documentation.

The difference is just whether you treat the document as a description or a contract.

---

*This post was written with AI assistance.*
