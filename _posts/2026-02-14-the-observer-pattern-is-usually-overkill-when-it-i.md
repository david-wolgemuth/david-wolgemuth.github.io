---
layout: post
title: "The Observer Pattern is usually overkill - when it isn't"
date: 2026-02-14
tags: [design-patterns, python]
excerpt: "Most codebases don't need the Observer pattern — until state changes need to ripple across unrelated subsystems without coupling them."
---

The Observer pattern shows up in textbooks as a clean way to decouple dependencies. In practice, it's usually unnecessary. When you do need it, though, nothing else works as cleanly.

## The Problem

You have state changes in one part of your system that need to trigger actions in several other parts — without the source knowing about the targets.

The naive approach is direct coupling:

```python
class OrderProcessor:
    def __init__(self, emailer, analytics, inventory):
        self.emailer = emailer
        self.analytics = analytics
        self.inventory = inventory

    def complete_order(self, order):
        order.status = "completed"
        self.emailer.send_confirmation(order)
        self.analytics.track_purchase(order)
        self.inventory.decrement_stock(order.items)
```

This works fine. For small systems, stop here.

The problem surfaces when:
- The list of "things that care" grows unpredictably
- Different environments need different listeners (dev vs prod)
- Order completion logic shouldn't know about email infrastructure
- Testing requires mocking five dependencies instead of zero

## The Pattern

The Observer pattern inverts the relationship. The subject maintains a list of observers and notifies them when state changes:

```python
class Observable:
    def __init__(self):
        self._observers = []

    def attach(self, observer):
        self._observers.append(observer)

    def notify(self, event):
        for observer in self._observers:
            observer.update(event)

class OrderProcessor(Observable):
    def complete_order(self, order):
        order.status = "completed"
        self.notify({"type": "order_completed", "order": order})
```

Observers register themselves:

```python
class EmailNotifier:
    def update(self, event):
        if event["type"] == "order_completed":
            self.send_confirmation(event["order"])

class AnalyticsTracker:
    def update(self, event):
        if event["type"] == "order_completed":
            self.track_purchase(event["order"])

# Setup
processor = OrderProcessor()
processor.attach(EmailNotifier())
processor.attach(AnalyticsTracker())
```

Now `OrderProcessor` knows nothing about email or analytics. It just processes orders and broadcasts events.

## When It Actually Helps

**Plugin architectures.** If your system loads modules dynamically or allows user-provided extensions, observers let plugins react to core events without modifying core code.

**Cross-cutting concerns.** Logging, metrics, audit trails — things that need to observe many different operations but shouldn't pollute business logic.

**Testing isolation.** When you can test order processing without instantiating email infrastructure, tests become faster and less brittle.

**Environment-specific behavior.** Dev observers might log to console; prod observers might send to monitoring services. The core logic stays identical.

## When It's Overkill

**Stable dependency sets.** If `OrderProcessor` always needs exactly these three dependencies, explicit constructor injection is clearer.

**Single observer.** If only one thing ever listens, you've added indirection for no gain. Just call the dependency directly.

**Simple callbacks.** If notification logic is trivial, a callback function beats a full observer interface:

```python
def complete_order(order, on_complete=None):
    order.status = "completed"
    if on_complete:
        on_complete(order)
```

**Early-stage codebases.** Premature decoupling creates abstraction debt. Wait until the dependency list actually becomes a problem.

## Practical Tradeoffs

The Observer pattern trades **local clarity** for **system flexibility**.

Reading `OrderProcessor.complete_order()` no longer shows what happens when an order completes. You have to trace observer registrations at startup to understand the full flow. (This is why IDEs struggle with "find usages" in observer-based code.)

In exchange, you can add or remove reactions without touching order processing logic. This matters when "things that need to know about orders" changes frequently or varies by deployment.

For most small-to-medium systems, direct coupling is fine. The Observer pattern earns its complexity when you're building for extensibility or when cross-cutting concerns start to dominate your constructor signatures.

---

*Draft generated with assistance from Claude Code. Edited and opinionated parts are mine.*
