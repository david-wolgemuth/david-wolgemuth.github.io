---
layout: post
title: "The Repository pattern in a 50-person startup"
date: 2026-01-18
tags: [design-patterns, startup, python]
excerpt: "Most startups don't need a Repository pattern. Here's when that changes."
---

## The Messy Reality

Last week I spent an hour debugging a test that was failing because it was hitting the production database. Not a staging database. Production.

The test file had `from myapp.models import User` at the top, which pulled in Django's ORM, which had been configured with production credentials in a poorly-managed settings file. The test passed locally (pointing at local Postgres) and exploded in CI (which, for reasons I still don't fully understand, had production credentials baked in).

This isn't a story about credential management. It's a story about coupling.

The test didn't need a database at all. It was testing business logic—"does this function correctly calculate a user's subscription tier based on their usage?" But because the function signature was `def calculate_tier(user: User)`, and `User` was a Django model, and Django models carry their database connections like luggage, the test couldn't run without a real database.

## What's Actually Happening

In a 10-person startup, this doesn't matter. You have one database, one environment, one way of doing things. The coupling between your business logic and your data layer is a feature, not a bug—it means fewer abstractions to maintain.

But somewhere around 50 people, things shift. You get:

- Multiple services that need to share data concepts but not database connections
- A growing test suite that takes 20 minutes because every test touches the database
- An engineer who wants to swap Postgres for a different datastore for one use case
- A compliance requirement that means certain queries need to be audited

Suddenly, the tight coupling between "what a User is" and "how a User is stored" becomes friction.

## The Pattern

The Repository pattern is just this: separate the "what" from the "where."

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

The Repository is what bridges the gap:

```python
class UserRepository:
    def get(self, user_id: str) -> UserData:
        django_user = User.objects.get(id=user_id)
        return UserData(
            id=django_user.id,
            monthly_usage=django_user.monthly_usage
        )
```

Now my test can do:

```python
def test_enterprise_tier():
    user = UserData(id="123", monthly_usage=15000)
    assert calculate_tier(user) == "enterprise"
```

No database. No credentials. No Django. Just data and logic.

## Why This Keeps Showing Up

I've seen this pattern emerge independently at three different startups, always around the same company size. The reason is structural.

Small teams can hold the entire system in their heads. When there's one way to access data, and everyone knows it, the abstraction layer is human—it's the shared understanding among five engineers who all joined within six months of each other.

At 50 people, that breaks down. New engineers don't have the context. Teams form around different parts of the system. The person writing the billing logic and the person managing the database schema stop being in every standup together.

The Repository pattern is really about creating an explicit boundary that used to be implicit. It's organizational design reflected in code.

## What Helps

If you're feeling the pain of tight coupling but don't want to over-architect:

**Start with tests.** The first place the Repository pattern pays off is testing. If you can write `InMemoryUserRepository` that holds a dict instead of hitting the database, your test suite gets faster and more reliable. You don't need to convert your whole codebase—just the hot paths.

**Use dataclasses, not ORMs, at the boundary.** The moment you pass a Django model or SQLAlchemy object into business logic, you're coupled. Dataclasses or TypedDicts create a seam where you can swap implementations.

**Don't build for portability you don't need.** I've seen teams implement the Repository pattern with pluggable adapters for Postgres, MySQL, MongoDB, and DynamoDB when they only used Postgres and had no plans to change. The abstraction became more complex than the thing it abstracted.

**Consider the read/write asymmetry.** Most apps read far more than they write. Sometimes it makes sense to have a Repository for writes (where you need transaction boundaries and consistency) but let reads go directly to the database (where you need performance and flexibility).

## What I'm Still Unsure About

The pattern creates a real cost: you now have two representations of every entity—the domain object and the database model. In a fast-moving startup, keeping these in sync is friction. Every schema change means updating both layers.

There's also a gray zone around "how much logic belongs in the Repository?" Some teams end up with Repositories that have methods like `get_users_who_should_receive_weekly_email()`, which pushes business logic into the data layer. Others keep Repositories thin but then have complex orchestration code that makes multiple Repository calls. Neither feels quite right.

The honest answer is that the Repository pattern is a tool for a specific moment in a company's growth. Too early and it's overhead. Too late and you're untangling years of coupled code. The skill is recognizing when you're in the window where it helps.

---

*This post was written with AI assistance and human curation.*
