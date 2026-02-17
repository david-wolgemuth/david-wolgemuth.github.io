---
layout: post
title: "My preferred scrum cadence"
date: 2026-02-17
tags: [engineering-management, process, scrum, meetings]
excerpt: "A template for meeting structure I've pushed for on several teams — artifacts over discussion, ownership over attendance."
---

I've pushed a version of this template on a few different teams. It's not doctrine — it should be tailored to the team's size, velocity, and maturity. But the core ideas have held up: every meeting needs an owner, every meeting produces an artifact, and async is a first-class citizen, not an afterthought.

<blockquote markdown="1">

# [Team Name] Planning & Meeting Structure

## Purpose

Define a clear, repeatable meeting structure where:

* Every meeting has a defined owner.
* Every meeting produces an explicit deliverable.
* Time is allocated intentionally.
* Asynchronous updates are part of the operating model, not an afterthought.

This document defines meeting mechanics only.

---

# Guiding Principles

1. Every meeting has:

   * A stated owner at the start.
   * A clear deliverable by the end.
   * A visible artifact (Jira board state, ordered backlog, Slack summary, etc.).

2. Meetings exist to produce artifacts, not discussion.

3. If a deliverable cannot be named, the meeting should not exist.

4. Ownership:

   * Default owner: Lead or Manager.
   * Rotating ownership is allowed.
   * Owner is responsible for:

     * Stating goal at the beginning.
     * Managing time blocks.
     * Ensuring deliverable is produced.

---

# Weekly Rhythm Overview

Example structure (adjust days as needed):

* Monday: Async Standup (Slack)
* Tuesday: Planning (biweekly, 60 min)
* Wednesday: Async Midweek Update (Slack)
* Thursday: Backlog Refinement (biweekly, 60 min, alternating with Planning week)
* Friday: Async Weekly Summary

Planning and Backlog Refinement occur every two weeks, in alternating cadence or same week depending on team preference.

---

# Biweekly Planning (60 Minutes)

## Purpose

Commit the team to the next two weeks of work.

## Owner

Declared at the beginning (Lead or Manager by default).

## Deliverable

By the end of the meeting:

* Sprint window defined (start + end dates).
* Tickets committed.
* Clear owner per ticket.
* Visible Jira board reflecting the sprint.

If this is not produced, the meeting is incomplete.

## Structure (60 Minutes)

* 5 min — Opening

  * Owner states:

    * Sprint window
    * Goal of this sprint
    * Expected deliverable

* 15 min — Review Previous Sprint

  * What was committed?
  * What shipped?
  * What rolled?
  * Confirm board reflects reality.

* 30 min — Commit Work

  * Pull tickets into sprint.
  * Confirm clarity and ownership.
  * Ensure workload balance.

* 10 min — Finalize & Confirm

  * Read back commitments.
  * Confirm no ambiguity.
  * Confirm board state matches agreement.

---

# Biweekly Backlog Refinement (60 Minutes)

## Purpose

Prepare work so Planning is efficient and deterministic.

Refinement does not decide what to do next.
It makes upcoming work ready.

## Owner

Declared at start.

## Deliverable

By the end of the meeting:

* Tickets moved into "Ready" meet quality bar.
* Scope clarified.
* Large tickets broken down.
* Ambiguities documented.

If tickets are still vague, refinement is incomplete.

## Structure (60 Minutes)

* 5 min — Opening

  * Owner states which tickets will be reviewed.
  * Define target: "X tickets Ready by end."

* 45 min — Review & Break Down

  * Clarify scope.
  * Add missing details.
  * Split large work.
  * Capture open questions.

* 10 min — Ready Confirmation

  * Explicitly confirm which tickets are now Ready.
  * Confirm artifacts updated in Jira.

---

# Open Questions & Considerations

## Do We Need a Dedicated Prioritization Meeting?

Options:

1. No separate meeting.

   * Prioritization handled:

     * Asynchronously by Lead/Manager.
     * Confirmed during Planning.

2. Lightweight 30–45 min monthly prioritization.

   * Deliverable: Ordered top 10 backlog list.
   * No ticket editing, only ranking.

Decision pending.

---

# Asynchronous Meetings & Artifacts

Async updates are considered structured meetings with deliverables.

## 1. Async Standup (Daily, Slack)

Deliverable:

* Each engineer posts:

  * Yesterday: ticket #
  * Today: ticket #
  * Blockers

Owner:

* Rotating weekly moderator or Lead.
* Responsible for ensuring posts happen.

No discussion threads unless resolving blockers.

---

## 2. Midweek Async Status (Weekly, Slack)

Deliverable:

* Short update from each engineer:

  * % completion on committed work.
  * Risk to sprint commitments.
  * Any new scope discovered.

Owner:

* Lead or rotating owner posts the prompt.

Purpose:

* Avoid surprises at end of sprint.

---

## 3. Weekly Summary (Friday Async)

Deliverable:

* Posted summary including:

  * What shipped.
  * What rolled.
  * Any scope shifts.

Owner:

* Manager or rotating.

Purpose:

* Transparency across team.
* Creates historical record.

---

# Meeting Ownership Model

At the start of each meeting:

Owner states:

* "Today's goal is: [deliverable]."
* "By the end of this meeting we will have: [artifact]."
* "I will timebox us as follows: …"

Ownership can rotate but must always be explicit.

---

# Definition of Success

This structure is successful if:

* Planning ends with a committed, visible sprint.
* Refinement ends with a clearly Ready backlog.
* Async updates prevent end-of-sprint surprises.
* Meetings feel shorter because outcomes are concrete.

This document governs meeting mechanics only.

</blockquote>

---

*This post was drafted with AI assistance.*
