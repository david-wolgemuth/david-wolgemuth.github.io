---
layout: post
title: "Context managers are Python's best-kept secret"
date: 2026-01-26
tags: [design-patterns, python]
excerpt: "The with statement solves cleanup problems you didn't know you had."
---

Most Python tutorials introduce context managers with file handling: `with open('file.txt') as f:`. This undersells them dramatically. Context managers solve a class of problems that otherwise require careful discipline, scattered try/finally blocks, or (more commonly) bugs that only surface under pressure.

## The Pattern

A context manager wraps a resource lifecycle: acquire on entry, release on exit. The `with` statement guarantees the exit runs, even when exceptions occur.

```python
with acquire_resource() as resource:
    use(resource)
    # exit code runs here, always
```

The naive alternative:

```python
resource = acquire_resource()
try:
    use(resource)
finally:
    release(resource)
```

Three lines become one. More importantly: the cleanup logic lives next to the acquisition logic, not scattered wherever the resource gets used.

## Where This Actually Matters

File handles are the textbook case, but the pattern shines in messier situations:

**Database connections** - A common failure mode: code acquires a connection, an exception fires somewhere deep in business logic, and the connection never returns to the pool. Under load, the pool exhausts. Context managers make this class of bug structurally impossible.

```python
# Before: connection leak if anything raises
conn = pool.get_connection()
result = execute_query(conn, query)  # might raise
conn.release()  # never reached

# After: always releases
with pool.get_connection() as conn:
    result = execute_query(conn, query)
```

**Browser automation** - When automating browser sessions, leaked tabs accumulate. A browser page context manager ensures cleanup regardless of whether the automation succeeded:

```python
class BrowserPage:
    def __init__(self, url):
        self.url = url
        self.page = None

    def __enter__(self):
        self.page = browser.new_page()
        if self.url:
            self.page.goto(self.url)
        return self.page

    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.page:
            try:
                self.page.close()
            except:
                pass  # best effort cleanup
```

The comment in `__exit__` is telling: cleanup code often needs to be defensive. The resource might already be in a bad state. The context manager absorbs that complexity once, at the definition site.

**Temporary state changes** - Context managers work well for "do X, then undo X" patterns: changing directories, modifying environment variables, acquiring locks.

```python
@contextmanager
def working_directory(path):
    original = os.getcwd()
    os.chdir(path)
    try:
        yield
    finally:
        os.chdir(original)

with working_directory('/tmp'):
    # do work in /tmp
# back to original directory
```

## The `contextlib` Shortcut

Writing `__enter__` and `__exit__` methods gets tedious for simple cases. The `contextlib` module provides a decorator that turns a generator into a context manager:

```python
from contextlib import contextmanager

@contextmanager
def timer(name):
    start = time.time()
    try:
        yield
    finally:
        elapsed = time.time() - start
        print(f"{name}: {elapsed:.2f}s")
```

Everything before `yield` runs on enter; everything after runs on exit. The `try/finally` ensures cleanup happens even when the body raises.

## When to Use This

Context managers fit any situation where:

1. You acquire something that must be released
2. You change state that must be restored
3. You need guaranteed cleanup regardless of how execution exits

In small teams with high code churn, context managers prevent a specific class of bug: the "works fine until we hit an edge case that raises, then resources leak" bug. These bugs are hard to reproduce and tend to surface during incidents.

The pattern also makes code review easier. When resource acquisition and cleanup are co-located, reviewers can verify correctness at a glance rather than tracing through multiple functions.

## Tradeoffs

Context managers do add indentation and can feel ceremonial for truly simple cases. If cleanup is trivial and the code path is obvious, a plain try/finally might be clearer. The pattern earns its keep when resources are expensive, cleanup is error-prone, or the code might evolve in ways that add failure modes.

The standard library leans heavily on context managers: files, locks, sockets, decimal contexts, warnings filters. When building libraries or tools that manage resources, following this convention makes the API feel Pythonic.

---

*This post was written with AI assistance.*
