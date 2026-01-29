---
layout: post
title: "Context managers are Python's best-kept secret"
date: 2026-01-29
tags: design-patterns python
excerpt: "The with statement does more than close files. It encodes invariants that would otherwise scatter across your codebase."
---

Most Python developers first encounter context managers through file I/O:

```python
with open("data.txt") as f:
    content = f.read()
```

File gets closed. Great. But this barely scratches the surface.

Context managers solve a deeper problem: ensuring that setup and teardown happen together, even when exceptions interrupt the code between them.

## The Pattern Nobody Teaches

The naive approach to resource management:

```python
def update_task_status(task_id, new_status):
    old_path = get_path(old_status, task_id)
    new_path = get_path(new_status, task_id)

    # Delete old file
    old_path.unlink()  # <-- if we crash here...

    # Write new file
    new_path.write_text(task.to_markdown())  # ...this never runs
```

The window between delete and write is small. But small windows have a way of causing data loss at the worst possible moments—process crashes, disk full, permission errors.

The fix involves temporary files and atomic renames. But the real insight is that "write then rename then delete" is a *bounded operation*. It has a beginning and an end. When those boundaries matter, context managers make them explicit:

```python
with atomic_file_swap(old_path, new_path) as tmp:
    tmp.write_text(task.to_markdown())
# atomic rename happens here, old file deleted only after success
```

The caller can't forget the cleanup. The cleanup can't be skipped by an early return. The invariant is encoded in the structure.

## Beyond Resource Cleanup

Context managers aren't limited to I/O resources. Any paired operation works:

**Temporary state changes:**

```python
with suppressed_logging():
    noisy_library.do_thing()
# logging restored automatically
```

**Scoped configuration:**

```python
with feature_flag("new_checkout", enabled=True):
    run_tests()
# flag reset to previous value
```

**Lock acquisition:**

```python
with file_lock(f"{task_id}.lock"):
    # exclusive access guaranteed
    update_task(task_id)
# lock released, even if update_task raises
```

**Database transactions:**

```python
with db.transaction():
    create_user(email)
    send_welcome_email(email)  # if this fails, user creation rolls back
```

The pattern: something needs to be true *for the duration of a block*, then undone. Context managers guarantee the "undone" part.

## The Two Flavors

**Class-based** (when you need state):

```python
class BrowserPage:
    def __init__(self, url):
        self.url = url
        self.page = None

    def __enter__(self):
        self.page = browser.new_page()
        self.page.goto(self.url)
        return self.page

    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.page:
            self.page.close()
        # return False to propagate exceptions (usually what you want)
```

**Decorator-based** (when you don't):

```python
from contextlib import contextmanager

@contextmanager
def timed_section(name):
    start = time.time()
    yield
    print(f"{name}: {time.time() - start:.2f}s")
```

The decorator version is less boilerplate for simple cases. The class version gives you more control—you can store state, handle different exception types, or suppress specific errors.

## When Not to Use Them

Context managers add structure. Sometimes that structure is overhead:

**Single-use cleanup:** If cleanup happens once at the end of a function and doesn't need exception safety, a simple `finally` block is clearer.

**Already exception-safe code:** If the operation is already atomic (a single function call, an HTTP request), wrapping it gains nothing.

**Deeply nested contexts:** Three or four nested `with` statements signal that something structural is off. Consider whether the contexts should be combined or the code factored differently.

## The Behavioral Contract

This is the real value: context managers encode behavioral contracts.

When a function returns a context manager, it's promising something:
- Setup happens before `yield`/`__enter__`
- Teardown happens after the block, no matter what
- The caller can't forget, skip, or reorder these steps

Compare to documentation: "remember to call cleanup()". Context managers make "remember" unnecessary.

---

*AI-assisted post. Patterns drawn from real code dealing with file operations, browser automation, and lock management.*
