---
layout: post
title: "Context managers are Python's best-kept secret"
date: 2026-02-17
tags: [design-patterns, python]
excerpt: "Context managers do more than open files. They're the cleanest way Python has to express 'do this, then always do that.'"
---

Everyone knows `with open(...)`. Fewer people write their own context managers. That's a gap worth closing.

## The problem they solve

A common pattern in real code: you acquire something, do work, then must release it — regardless of whether the work succeeded.

The naive version looks like this:

```python
lock.acquire()
do_the_thing()
lock.release()  # skipped if do_the_thing() raises
```

The slightly less naive version:

```python
lock.acquire()
try:
    do_the_thing()
finally:
    lock.release()
```

This works. It's also boilerplate that will be copy-pasted, sometimes incorrectly, every time the pattern recurs. Context managers are the abstraction Python provides to avoid that.

## The protocol

A context manager implements two methods: `__enter__` and `__exit__`. The `with` statement calls `__enter__` on entry and `__exit__` on exit — unconditionally, even if an exception was raised.

```python
class ManagedLock:
    def __init__(self, lock):
        self.lock = lock

    def __enter__(self):
        self.lock.acquire()
        return self.lock  # available as `as` target

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.lock.release()
        return False  # don't suppress exceptions
```

Usage:

```python
with ManagedLock(lock) as l:
    do_the_thing()
# lock released here, always
```

The `__exit__` signature is worth noting. It receives exception info if one was raised — `exc_type`, `exc_val`, `exc_tb` — and can suppress the exception by returning `True`. Returning `False` (or `None`) lets it propagate normally.

## The `contextlib` shortcut

Writing a class is often overkill. For most cases, `contextlib.contextmanager` converts a generator function into a context manager:

```python
from contextlib import contextmanager

@contextmanager
def managed_lock(lock):
    lock.acquire()
    try:
        yield lock  # caller receives this as `as` target
    finally:
        lock.release()
```

The `yield` is the boundary. Everything before is `__enter__`; everything after (in the `finally`) is `__exit__`. This covers the vast majority of practical use cases without a class.

## Where this actually shows up

Beyond locks and files, context managers are useful anywhere setup/teardown needs to be paired:

**Database transactions:**

```python
@contextmanager
def transaction(conn):
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
```

**Temporary state:**

```python
@contextmanager
def temp_env(key, value):
    old = os.environ.get(key)
    os.environ[key] = value
    try:
        yield
    finally:
        if old is None:
            del os.environ[key]
        else:
            os.environ[key] = old
```

**Timing blocks** (useful in tests or profiling):

```python
@contextmanager
def timed(label):
    start = time.monotonic()
    try:
        yield
    finally:
        elapsed = time.monotonic() - start
        print(f"{label}: {elapsed:.3f}s")
```

Each of these replaces a try/finally that would otherwise repeat across callsites.

## Stacking and reuse

Context managers compose cleanly:

```python
with conn_pool.get() as conn, transaction(conn) as tx:
    tx.execute(...)
```

Python's `with` statement accepts multiple managers — they're entered left to right and exited right to left (LIFO). This mirrors nested `with` blocks but is more readable when the nesting is shallow.

`contextlib.ExitStack` handles the dynamic case — when you don't know at write-time how many managers you need:

```python
with ExitStack() as stack:
    files = [stack.enter_context(open(f)) for f in filenames]
    process(files)
# all files closed here
```

This is especially useful in tests and setup code where resource lists are built at runtime.

## Tradeoffs

The abstraction earns its weight when the setup/teardown pair is reused across multiple callsites, or when the teardown logic is non-trivial enough that forgetting it would cause real bugs.

For one-off cases — a single try/finally that lives in a single function — the context manager is probably indirection without benefit. Prefer the explicit form when the pair isn't shared.

Also: context managers don't compose perfectly with async code out of the box. For `async with`, you need `__aenter__` / `__aexit__`, or the `asynccontextmanager` decorator from `contextlib`. Not harder, just a separate thing to know.

## The pattern in one sentence

Context managers express "do this, then always do that" as a reusable unit — and Python gives you a clean decorator-based syntax to write them without ceremony.

The standard library already uses them everywhere: files, locks, database connections, mock patches, temporary directories. Writing your own is a natural extension of the same idea.

---

*This post was written with AI assistance.*
