---
layout: post
title: "Dependency injection without a framework"
date: 2026-01-31
tags: design-patterns python
excerpt: "Most Python code doesn't need a DI container. Here's the pattern that gets you 90% of the benefit with zero dependencies."
---

The phrase "dependency injection" carries baggage. In Java and C#, it evokes Spring or Ninject, XML configuration files, autowiring decorators, and container lifecycles. Teams adopt these frameworks because DI "is how you do testing" and "is how you write maintainable code."

Python doesn't need any of that.

## What DI actually is

Dependency injection is passing things in instead of creating them internally. That's the whole pattern.

```python
# Before: hard dependency
class UserService:
    def __init__(self):
        self.db = PostgresClient()  # locked in
```

```python
# After: injected dependency
class UserService:
    def __init__(self, db):
        self.db = db  # whatever you pass
```

The second version is dependency injection. No framework required. The caller decides what `db` means — production Postgres, test mock, or something else entirely.

## The pattern in practice

A common structure that works well at the 50-300 person startup scale:

```python
from abc import ABC, abstractmethod

class StorageClient(ABC):
    """Abstract interface."""

    @abstractmethod
    def save(self, key: str, data: bytes) -> None:
        pass

    @abstractmethod
    def load(self, key: str) -> bytes | None:
        pass


class S3Client(StorageClient):
    """Production implementation."""

    def __init__(self, bucket: str):
        self._bucket = bucket
        self._client = boto3.client("s3")

    def save(self, key: str, data: bytes) -> None:
        self._client.put_object(Bucket=self._bucket, Key=key, Body=data)

    def load(self, key: str) -> bytes | None:
        # implementation...


class LocalClient(StorageClient):
    """Development/testing implementation."""

    def __init__(self, directory: Path):
        self._dir = directory

    def save(self, key: str, data: bytes) -> None:
        (self._dir / key).write_bytes(data)

    def load(self, key: str) -> bytes | None:
        path = self._dir / key
        return path.read_bytes() if path.exists() else None
```

The interface (ABC) is optional but useful. It documents the contract and gives type checkers something to verify against.

## Factory functions over containers

Where DI frameworks provide containers and autowiring, Python can use plain factory functions:

```python
def get_storage(env: str | None = None) -> StorageClient:
    """
    Get a storage client for the current environment.

    Reads from STORAGE_ENV by default.
    """
    env = env or os.environ.get("STORAGE_ENV", "local")

    if env == "production":
        return S3Client(bucket=os.environ["S3_BUCKET"])
    elif env == "local":
        return LocalClient(Path("./data"))
    else:
        raise ValueError(f"Unknown storage env: {env}")
```

Call sites become:

```python
storage = get_storage()
storage.save("report.json", data)
```

Tests bypass the factory entirely:

```python
def test_report_generation():
    storage = LocalClient(tmp_path)
    generator = ReportGenerator(storage)
    generator.run()
    assert storage.load("report.json") is not None
```

The factory handles environment-aware construction. Tests pass explicit implementations. No container, no magic, no decorators.

## When this pattern fails

This approach stops working cleanly when:

**Deep dependency chains.** If `ServiceA` needs `ServiceB` which needs `ServiceC` which needs `ClientD`, manually threading dependencies through constructors becomes tedious. At that point, either flatten your dependency graph (often the right fix) or consider a container.

**Lifecycle management.** If dependencies need cleanup — database connections, file handles, background threads — you need to manage that yourself. Context managers help:

```python
@contextmanager
def production_services():
    db = DatabasePool(...)
    cache = RedisClient(...)
    try:
        yield Services(db=db, cache=cache)
    finally:
        cache.close()
        db.close()
```

**Heavy runtime reconfiguration.** Some systems genuinely need to swap implementations at runtime based on feature flags or tenant configuration. That's a real use case for more sophisticated machinery.

## When frameworks earn their keep

DI frameworks like `dependency-injector` or `injector` make sense when:

- You have 50+ services with complex interdependencies
- Multiple entry points need the same object graph
- You need per-request scoping (web frameworks)
- Team members are familiar with container patterns from other languages

For a 20-service system with clear boundaries, factory functions are usually cleaner. The decision point tends to be around complexity of the object graph, not codebase size.

## The testing benefit

The primary payoff of DI isn't swappable production backends — it's testability.

```python
class MockStorage(StorageClient):
    def __init__(self):
        self.saved = {}

    def save(self, key: str, data: bytes) -> None:
        self.saved[key] = data

    def load(self, key: str) -> bytes | None:
        return self.saved.get(key)
```

Tests using `MockStorage` run instantly, never hit the network, and fail deterministically. This alone justifies the pattern.

## Summary

Dependency injection in Python is just passing arguments. The pattern:

1. Accept dependencies through constructors (or function parameters)
2. Define interfaces when helpful for documentation or type checking
3. Use factory functions for environment-aware construction
4. Pass explicit implementations in tests

No container. No autowiring. No framework. This covers most cases at startup scale, and you can always add a framework later if the object graph genuinely demands it.

---

*This post was written with AI assistance.*
