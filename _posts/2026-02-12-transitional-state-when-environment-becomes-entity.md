---
layout: post
title: "Transitional state - when environment becomes entity"
date: 2026-02-12
tags: design-patterns python
excerpt: "Sometimes configuration stops being configuration and starts being data. Recognizing this transition prevents accidental complexity."
---

Most systems start with environment variables. At some point, they need a settings table. The moment this becomes obvious is rarely the moment it should have happened.

## The Pattern

Environment state becomes an entity when:
1. It has meaningful history (not just "current value")
2. Different parts of the system need different values
3. Changes require auditability or rollback
4. The value has lifecycle events (approval, expiration, propagation delay)

Common false trigger: "We need to change this without deploying." That's a workflow problem, not a data model problem.

## Example: Feature Flags

**Naive (environment variable):**

```python
import os

FEATURE_ENABLED = os.getenv("ENABLE_NEW_CHECKOUT", "false").lower() == "true"

def checkout(cart):
    if FEATURE_ENABLED:
        return new_checkout_flow(cart)
    return legacy_checkout(cart)
```

Works fine until you need:
- Per-user rollout
- Scheduled enablement
- "Who turned this on and when?"

**Transitional (still just config, but structured):**

```python
from dataclasses import dataclass
from typing import Optional

@dataclass
class FeatureFlags:
    new_checkout_enabled: bool = False

    @classmethod
    def from_env(cls):
        return cls(
            new_checkout_enabled=os.getenv("ENABLE_NEW_CHECKOUT", "false") == "true"
        )

FLAGS = FeatureFlags.from_env()
```

Still environment-based. Now with type safety and a clear place to add fields. But fundamentally unchanged.

**Entity (when history and context matter):**

```python
@dataclass
class FeatureFlag:
    key: str
    enabled_for_users: set[str]
    enabled_at: Optional[datetime]
    modified_by: str

class FeatureFlagStore:
    def is_enabled(self, key: str, user_id: str) -> bool:
        flag = self._get_flag(key)
        if not flag:
            return False
        return user_id in flag.enabled_for_users

    def enable_for_user(self, key: str, user_id: str, modified_by: str):
        flag = self._get_or_create(key)
        flag.enabled_for_users.add(user_id)
        flag.modified_by = modified_by
        self._save(flag)
```

Now it's data. Stored, versioned, auditable. The flag itself has become a domain concept.

## When NOT to Promote

Environment state is appropriate when:
- Value is genuinely deployment-scoped (API keys, hostnames, DB connection strings)
- No runtime variance needed
- Change frequency matches deploy frequency
- History is irrelevant

Database connection strings don't need audit trails. Feature flags often do.

## The Gradient

This isn't binary. There's a gradient between "pure environment" and "full entity":

| Stage | Example | When Sufficient |
|-------|---------|-----------------|
| Raw env var | `os.getenv("TIMEOUT")` | Single service, no variance |
| Structured config | `Settings.from_env()` | Type safety, validation needed |
| Cached remote config | `config_service.get("timeout")` | Centralized, but still read-only at runtime |
| Entity with lifecycle | `ConfigEntity(value=..., modified_by=...)` | History, auditability, complex state |

## Real-World Signals

Signs you're in the transitional zone:
- Config changes blocked on deploy pipelines, causing friction
- JSON blobs in environment variables (you're smuggling structure)
- "Just restart the service" is your config update strategy, and it's starting to hurt
- Different environments need subtly different behavior—not just different values

If you're reaching for `json.loads(os.getenv("COMPLEX_SETTING"))`, you're halfway to a database table. Finish the migration.

## The Migration

Typical path:
1. Start with env vars (appropriate for early-stage systems)
2. Add structured config object (type safety, validation)
3. Move to remote config service when deploy-gated changes cause friction
4. Promote to entity when history or multi-tenancy becomes load-bearing

Each step should be triggered by actual need, not anticipation. Premature entityification is worse than delayed migration—it adds persistence overhead for purely environmental concerns.

The trick is recognizing when you've crossed the line. When "Who changed this?" becomes a question you can't answer, you've waited too long.

---

*This post was written with assistance from Claude (Anthropic). Structure and ideas are human; prose was collaboratively refined.*
