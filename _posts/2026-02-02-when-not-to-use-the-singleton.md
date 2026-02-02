---
layout: post
title: "When NOT to use the Singleton"
date: 2026-02-02
tags: design-patterns python startup testability
excerpt: "Singletons solve the 'exactly one' problem. But that's rarely your actual problem."
---

The Singleton pattern gets a bad reputation, and most of the criticism is deserved. But the failure mode isn't "singletons are inherently evil." It's reaching for the pattern when the constraints it enforces don't match your actual problem.

## The Pattern

```python
class DatabaseConnection:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._connect()
        return cls._instance
```

A Singleton guarantees exactly one instance exists and provides global access to it.

That's two things. And conflating them is where the trouble starts.

## What Problem Are You Actually Solving?

**"There should only be one database connection"**—fine, but this is usually a configuration constraint, not a code structure constraint. You want *one* connection pool, not a guarantee that the language itself prevents creating another.

**"I need to access this from everywhere"**—this is the global access part. And it's often the real motivation, dressed up as architectural rigor.

The tell: if you could solve the problem by passing the dependency explicitly, the Singleton isn't adding value. It's adding indirection.

## When Singletons Hurt

### Testing Becomes Painful

```python
def process_order(order):
    db = DatabaseConnection()  # Singleton
    db.save(order)
```

To test this function, you have to replace the entire `DatabaseConnection` singleton, typically by monkey-patching the class or resetting hidden state. The function isn't asking for what it needs—it's reaching into global state to get it.

Compare:

```python
def process_order(order, db):
    db.save(order)
```

Now testing is trivial. Pass a mock. The function's dependencies are visible in its signature.

### Hidden Coupling

Singletons make dependency graphs invisible. When `FeatureA` calls `Logger()` and `FeatureB` calls `Logger()`, there's no indication that both depend on the same stateful object. In small codebases, this is fine. In larger ones, you get mysterious test failures because some test didn't reset the logger's internal state.

### Configuration at Import Time

Singletons often get configured when first accessed. This means configuration order depends on import order, which depends on file layout and test discovery. Subtle bugs that only appear in certain test orderings are a special kind of miserable.

## The Underlying Pattern

Most Singleton usage can be decomposed into:

1. **A thing that should exist once** (connection pool, feature flag cache)
2. **A way to provide that thing to code that needs it** (injection, context)

The Singleton conflates these. Separating them usually leads to better code:

```python
# At the boundary of your application
connection_pool = create_connection_pool(config)

# Deep in your code
def save_user(user, db):  # Receives pool explicitly
    db.save(user)
```

"But I don't want to pass `db` through 47 functions!" Fair. That's where request-scoped context, dependency injection containers, or even simple module-level instances (not Singletons—just instances) come in.

## When Singletons Are Fine

The pattern isn't always wrong. It fits when:

- The "exactly one" guarantee matters at the language level (not just convention)
- Configuration is truly static and known at module load time
- The cost of passing the dependency explicitly is genuinely prohibitive

Logging is a borderline case. Most codebases treat `logging.getLogger(__name__)` as acceptable global state. The logger's state (handlers, formatters) can still cause test pollution, but the convenience often wins in practice.

## The Refactoring Path

If you've inherited Singleton-heavy code:

1. Make the Singleton optionally accept an instance in its constructor
2. In tests, inject mocks directly
3. Gradually migrate callers to receive dependencies explicitly
4. Eventually, the Singleton becomes a factory function that the application boundary calls once

You don't need a Big Rewrite. You just need to stop reaching for global state by default.

## In Practice

The pattern question is: *What constraint am I encoding?*

If the answer is "I want exactly one of these, enforced by the language," that's a Singleton.

If the answer is "I want code to easily access a shared resource," that's a different problem. Singletons are one answer, but dependency injection, module-level instances, and request-scoped context are often better ones—because they separate "where does this live" from "how does code get it."

When in doubt: if passing the dependency explicitly works, do that. You'll write more testable code, and you can always add global access later if you genuinely need it.

---

*This post was written with AI assistance.*
