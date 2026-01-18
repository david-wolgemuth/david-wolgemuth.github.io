---
layout: post
title: "Technical debt isn't a mistake - it's a loan with interest you don't control"
date: 2026-01-18
tags: systems-thinking technical-debt startup
excerpt: "You took out the loan deliberately. The interest rate was set by someone else."
---

## The Messy Reality

Here's a familiar story: your team needed to ship something fast. The quarterly deadline was real. The customer contract had a launch date in it. Someone said "we can clean this up later" and everyone agreed because the alternative was missing the window.

So you shipped the quick solution. The hacky integration. The "temporary" workaround.

Six months later, that code is still there. Except now it's load-bearing. Three other features depend on it. A new engineer just spent two days debugging something that "shouldn't be possible" but was—because of an assumption baked into that quick solution.

This is the story we tell about technical debt. And it's not wrong. But it misses something important.

## What's Actually Happening

The standard framing treats technical debt like a mistake. Like you borrowed money you shouldn't have. If you'd just been more disciplined, you wouldn't be in this mess.

But here's the thing: you took the loan deliberately. That's not where the problem is.

The problem is that *you don't control the interest rate*.

When you take out a loan from a bank, you know the rate. 7%, 12%, whatever. You can calculate the total cost. You can decide if it's worth it.

Technical debt doesn't work that way. When you ship that quick solution, you have no idea what the interest will be. Maybe it'll be low—the code sits there quietly and nobody touches it. Maybe it'll be brutal—every new feature has to route around it, every bug leads back to it, every new hire stumbles on it during onboarding.

The interest rate is set by factors outside your control:
- How the product evolves (which you can't fully predict)
- What other systems need to integrate with it (unknowable at decision time)
- Who ends up maintaining it (might not even be hired yet)
- What the business priorities become (will anyone have time to fix it?)

You're not just borrowing against the future. You're borrowing against a future whose terms will be set by forces you can't see yet.

## The Pattern

This is a classic systems-thinking insight: local optimization creates global problems. The decision that was clearly correct in the moment creates costs that are distributed across time and people in ways that make them hard to see and harder to attribute.

The quick solution ships. Everyone moves on. The cost accrues slowly, in small increments:
- The new feature that takes 3 days instead of 1
- The bug that takes hours to find because the code doesn't do what it seems to do
- The refactor that keeps getting bumped to next quarter
- The institutional knowledge that lives in one person's head

None of these feel like "paying interest on technical debt." They feel like normal work friction. The connection to that decision six months ago is invisible.

And this is why the debt metaphor, while useful, is also misleading. Real debt is tracked. You get statements. You know what you owe. Technical debt just... accumulates. Silently. In ways that are only visible when you're already paying.

## Why This Keeps Showing Up

The incentive structure guarantees it.

At a growing startup, shipping is the thing that matters. It's not that people are wrong to prioritize shipping—they're right. The business needs revenue. The market has windows. Customers have deadlines. The cost of not shipping is concrete and immediate. The cost of shipping fast is abstract and deferred.

So the rational local decision is always "ship now, clean up later."

But "later" has its own pressures. There's always a next feature, a next deadline, a next customer contract. The cleanup never reaches the top of the priority list because it never has an urgent stakeholder. The code that needs refactoring doesn't send angry emails. The integration that's brittle doesn't show up in quarterly reviews.

This isn't a failure of discipline. It's a system behaving exactly as designed.

The thing is, you're also not wrong to take on the debt. Sometimes the loan is worth it. Shipping something imperfect that wins the contract is better than shipping nothing perfect. The startup that dies because it didn't ship fast enough doesn't get points for code quality.

The problem isn't that you borrowed. The problem is that you don't know what you're going to end up paying.

## What Helps

I don't have a fix for this. But some things help:

**Make the debt visible.** The worst part of technical debt is its invisibility. Write down what you're deferring and why. Put it somewhere that survives the sprint cycle. Future you (or future someone) will at least know where the bodies are buried.

**Pay attention to what's actually costing you.** Not what you think should be technical debt, but what's actually slowing people down. Sometimes the "worst" code sits quietly forever. Sometimes the "fine" code becomes a nightmare. Let reality guide the prioritization.

**Create space for incidental cleanup.** Not big refactors—those rarely happen. But normalizing small fixes during regular work. "While I'm in here, I'll clean this up" culture reduces the accumulation rate.

**Be honest about interest rates.** Some debt is low-interest: code that's isolated, rarely touched, with clear boundaries. Some debt is high-interest: code that's central, frequently modified, with tendrils everywhere. This isn't always predictable, but sometimes it is. That "temporary" solution in the authentication layer? That's not a 5% loan.

## What I'm Still Unsure About

I don't know how to systematically predict which debt will be expensive. Some of the worst code I've seen caused almost no ongoing problems because circumstances happened to route around it. Some of the "minor" shortcuts became the source of years of pain.

I also don't know how to balance this against the real need to ship. The advice to "take on less debt" is easy to say and mostly useless. The whole point is that taking on debt is often the correct local decision. The problem is systemic, not individual.

Maybe the best we can do is stay honest: you're making a bet. You're borrowing against a future you can't predict, at a rate that will be set by forces you don't control. Sometimes that's the right bet. But it's always a bet.

The system behaves exactly as designed—just not as intended.

---

*This post was drafted with AI assistance and human curation.*
