---
layout: post
title: "When the Repository Pattern Starts to Help"
date: 2026-01-18
tags: [design-patterns, python, architecture]
excerpt: "The Repository pattern solves a specific problem at a specific scale. Here's what that problem looks like and when the pattern pays off."
---

## The Failure Mode

A common failure mode in growing codebases: tests that depend on production infrastructure when they don't need to.

Consider a test for business logic—calculating a user's subscription tier based on usage. The function signature is `def calculate_tier(user: User)`, where `User` is a Django model. Django models carry their database connections implicitly. The test can't run without a real database, even though it's only testing arithmetic.

This isn't primarily a credential management problem. It's a coupling problem.

## When This Surfaces

In very small teams, this coupling cost is often acceptable. The system boundaries are implicitly understood, there's one database, one environment, one way of doing things. Fewer abstractions means less maintenance.

As teams grow—often somewhere around 40-60 engineers—the implicit understanding breaks down:

- Multiple services need to share data concepts but not database connections
- Test suites slow down because every test touches the database
- Someone needs a different datastore for a specific use case
- Compliance requirements mean certain queries need auditing

The tight coupling between "what a User is" and "how a User is stored" becomes friction.

## The Pattern

The Repository pattern separates the domain representation from the storage mechanism.

```python
# Before: Business logic coupled to Django ORM
def calculate_tier(user: User) -> str:
    if user.monthly_usage > 10000:
        return "enterprise"
    return "standard"

# After: Business logic works with plain data
@dataclass
class UserData:
    id: str
    monthly_usage: int

def calculate_tier(user: UserData) -> str:
    if user.monthly_usage > 10000:
        return "enterprise"
    return "standard"
```

The Repository bridges the gap:

```python
class UserRepository:
    def get(self, user_id: str) -> UserData:
        django_user = User.objects.get(id=user_id)
        return UserData(
            id=django_user.id,
            monthly_usage=django_user.monthly_usage
        )
```

Tests become simpler:

```python
def test_enterprise_tier():
    user = UserData(id="123", monthly_usage=15000)
    assert calculate_tier(user) == "enterprise"
```

No database. No credentials. No ORM. Just data and logic.

## Why This Tends to Emerge at Scale

The pattern is really about making explicit what used to be implicit.

Small teams can hold the entire system in their heads. When there's one way to access data and everyone knows it, the abstraction layer is human—shared understanding among engineers who all joined within a few months of each other.

At scale, that breaks down. New engineers lack context. Teams form around different parts of the system. The person writing billing logic and the person managing the database schema stop attending the same standups.

The Repository pattern is organizational design reflected in code.

## What Tends to Help

**Start with tests.** The first place this pattern pays off is testing. An `InMemoryUserRepository` that holds a dict instead of hitting the database makes test suites faster and more reliable. Converting the whole codebase isn't necessary—just the hot paths.

**Use dataclasses at the boundary.** The moment a Django model or SQLAlchemy object passes into business logic, the coupling exists. Dataclasses or TypedDicts create a seam where implementations can be swapped.

**Avoid premature abstraction.** Building pluggable adapters for Postgres, MySQL, MongoDB, and DynamoDB when only Postgres is in use creates more complexity than it solves.

**Consider read/write asymmetry.** Most applications read far more than they write. Sometimes a Repository for writes (where transaction boundaries and consistency matter) combined with direct database reads (where performance and flexibility matter) is the right tradeoff.

## Tradeoffs

The pattern creates real cost: two representations of every entity—the domain object and the database model. In a fast-moving codebase, keeping these in sync adds friction. Every schema change means updating both layers.

There's also ambiguity around how much logic belongs in the Repository. Some implementations end up with methods like `get_users_who_should_receive_weekly_email()`, which pushes business logic into the data layer. Others keep Repositories thin but require complex orchestration code with multiple Repository calls. Neither approach is obviously correct.

## Open Questions

The Repository pattern is a tool for a specific moment in a codebase's evolution. Applied too early, it's overhead. Applied too late, it means untangling years of coupled code.

The skill is recognizing when you're in the window where it helps—and that recognition often only comes from feeling the friction first.

---

*This post was written with AI assistance and human curation.*
