---
layout: post
title: "Using Git as a State Journal"
date: 2026-02-01
tags: [architecture, systems-thinking]
excerpt: "Git already tracks your code changes. It can also track your work state — what you're doing, what's stale, what's abandoned."
---

Most teams use git as a collaboration tool for shipping code. Commits, branches, PRs — the obvious stuff. But git's data model is quietly useful for something else: tracking the *state of work itself*, not just the artifacts.

The insight: if you're already pushing branches, you're already creating a queryable record of what's in progress, what's stuck, and what got abandoned.

## The Ephemeral State Problem

Work state tends to live in ephemeral places:
- Open terminal tabs (close them, lose context)
- Local uncommitted changes (laptop dies, work dies)
- Mental model of "what I'm doing" (sleep on it, forget half)
- Slack threads (scroll up far enough and context vanishes)

None of these are queryable. You can't ask: "What branches have I touched in the last week that don't have PRs?" or "What features did I start but never finish?"

Git can answer both.

## Branches as State Records

A branch is a pointer to work. The git log is a timeline. Combining these gives you a crude but useful journal:

```bash
# Branches I've touched recently, sorted by last commit
git for-each-ref --sort=-committerdate refs/heads/ \
  --format='%(committerdate:short) %(refname:short)'

# Output:
# 2026-01-30 feature-auth
# 2026-01-25 bugfix-csv
# 2026-01-12 experiment-caching  <- this one's getting stale
# 2025-12-20 api-cleanup         <- this one's abandoned
```

The stale ones surface themselves. No separate system needed — the journal writes itself through normal development.

## Push Everything

Here's where it gets interesting. If you push every branch immediately (even draft work), GitHub becomes a centralized state dashboard:

1. **Local change** → commit → push
2. **Branch exists on remote** → visible to anyone with repo access
3. **GitHub UI** → shows all open branches, last activity, CI status

This inverts the usual "push when ready" model. Instead: push early, push often, treat the remote as the working copy.

Benefits:
- **Audit trail** — Every commit is timestamped and attributed
- **Backup** — Laptop failure doesn't lose work
- **Visibility** — Team can see what's in flight without asking
- **CI feedback** — Tests run on every push, not just PR creation

The tradeoff is obvious: noise. Lots of branches, lots of work-in-progress visible. This works better in smaller teams where noise tolerance is higher, or with branch naming conventions that signal "this is draft work."

## Detecting Abandonment

Git timestamps make staleness detection trivial:

```python
def find_stale_branches(repo_path, days_threshold=14):
    """Return branches with no commits in N days."""
    result = subprocess.run(
        ["git", "for-each-ref", "--sort=committerdate",
         "--format=%(committerdate:unix) %(refname:short)",
         "refs/heads/"],
        cwd=repo_path, capture_output=True, text=True
    )

    cutoff = time.time() - (days_threshold * 86400)
    stale = []

    for line in result.stdout.strip().split('\n'):
        ts, branch = line.split(' ', 1)
        if int(ts) < cutoff:
            stale.append(branch)

    return stale
```

A branch sitting for two weeks without commits is either done (should be merged or deleted) or abandoned (should be archived or resurrected). The journal tells you which questions to ask.

## State Beyond Code

This pattern extends to non-code state if you're willing to commit structured data:

```yaml
# .workstate/feature-auth.yaml
name: "Auth refactor"
jira: RATE-1234
status: active
notes: |
  Migrating from session-based to JWT.
  Waiting on security review before merge.
```

Commit this file alongside code changes. Now `git log --oneline -- .workstate/` shows a timeline of status changes. The git history *is* the state journal — no separate database needed.

This is arguably over-engineering for most workflows. But for long-running branches (multi-week features, experimental work), having structured state in version control beats keeping it in your head.

## Tradeoffs

**When this works:**
- Solo or small team development
- High tolerance for branch noise
- Already using worktrees for parallel work
- Desire for durable, queryable work history

**When this doesn't:**
- Large teams with strict branch policies
- PRs are the only acceptable unit of visibility
- Compliance requirements around what gets committed
- "Push when done" culture that treats branches as private

The core question: is work state worth versioning? If your answer is "probably not," that's reasonable. Most teams get by with Jira tickets and Slack. But if you've ever lost context by closing a terminal, or forgotten what that three-week-old branch was for, git already has the answer — you just have to query it.

---

*AI-assisted writing.*
