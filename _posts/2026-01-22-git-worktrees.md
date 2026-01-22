---
layout: post
title: "Git Worktrees: Stop Stashing, Start Switching"
date: 2026-01-22
tags: [git, architecture, startup, workflow]
excerpt: "Worktrees let you have multiple branches checked out simultaneously. They're especially useful when juggling parallel work, code reviews, and AI coding sessions."
---

If you juggle multiple branches—a feature in progress, a hotfix waiting for CI, a colleague's PR to review—you've probably developed some coping mechanism. Stash, switch, forget what you stashed. Or commit half-baked code just to context-switch. Or clone the repo again into a second directory.

Git worktrees solve this without any of that ceremony.

## The Basic Idea

A worktree is a linked checkout of your repository at a different path. It shares the `.git` directory with your main checkout, so it has full commit history, all your branches, and no extra cloning required.

```bash
# Create a worktree for a feature branch
git worktree add ../feature-auth feature-auth

# Now you have two directories:
# ~/code/myproject          <- main branch
# ~/code/feature-auth       <- feature-auth branch
```

Both directories are live. Edit files in one, the other doesn't see it until you commit and switch. No stashing, no losing your place.

## Why This Matters

The common workaround—stash, switch, pop—works fine for quick context switches. But it breaks down in a few scenarios:

**Parallel CI runs.** Push a branch, CI takes 10 minutes. You want to start the next task but not lose your place. With worktrees, each branch lives in its own directory. You can work on three things while three CI pipelines run.

**Code reviews.** Colleague asks you to review a PR. You could `git stash && git checkout their-branch && <review> && git checkout - && git stash pop`. Or you could `git worktree add ../their-pr their-branch`, review in a second terminal, and delete the worktree when done.

**AI coding sessions.** When running multiple AI sessions in parallel (each working on a different feature), each session needs its own branch checked out. Worktrees make this trivial—each session gets its own directory, and they don't conflict.

## Practical Commands

```bash
# Create a worktree from existing branch
git worktree add <path> <branch>

# Create a worktree with a new branch
git worktree add -b new-feature ../new-feature

# List all worktrees
git worktree list

# Remove a worktree (deletes the directory and unlinks it)
git worktree remove <path>
```

The directory structure that tends to emerge:

```
~/code/
├── myproject/              <- main checkout (stays on main/master)
└── worktrees/
    ├── feature-auth/       <- feature branch
    ├── bugfix-csv/         <- hotfix branch
    └── pr-review-123/      <- colleague's PR
```

Keeping the main checkout on `main` means it's always ready to branch from, pull latest, or run quick comparisons. The worktrees directory is ephemeral—create, use, delete.

## Workflow Integration

The real value emerges when worktrees become part of a broader workflow. A few patterns that work well:

**Registry pattern.** Track which worktrees exist and what they're for. A simple YAML file or CLI wrapper can answer "what am I working on?" and surface stale worktrees (no commits in 14 days, for example).

**Submodule + worktree combo.** If you manage multiple repositories as submodules, keep each submodule on `main` and use worktrees for branch work. The submodule tracks the commit pointer; worktrees handle the active development.

```bash
# Submodule stays on main
cd managed_repos/mylib

# Worktree for feature work
git worktree add ~/worktrees/mylib/new-feature new-feature
```

**Session isolation.** Each AI coding session or terminal tab can point to its own worktree. When the session ends, the worktree can be cleaned up without affecting other work.

## Trade-offs

Worktrees aren't free:

**Disk space.** Each worktree is a full checkout of the working tree (not the `.git` directory, which is shared). For large repos with many generated files, this adds up.

**Mental overhead.** You now have multiple directories to track. Without some discipline (or tooling), worktrees accumulate and become their own form of clutter.

**IDE support varies.** Some editors handle multiple worktrees gracefully. Others get confused about which `.git` to use or which branch you're "really" on. Test with your setup.

## When Not to Bother

If you rarely switch branches mid-work, or if your switches are quick (a few minutes), stash-switch-pop is fine. Worktrees shine when:

- You have 3+ parallel workstreams
- CI feedback loops are long
- You're coordinating multiple AI agents
- You want a clean "always on main" directory for quick comparisons

For simpler workflows, the overhead of managing worktrees may not pay off.

## Summary

Git worktrees are a lightweight way to have multiple branches checked out simultaneously. They share git history with your main checkout, so there's no extra cloning. The pattern works well when juggling parallel work, waiting on CI, reviewing PRs, or running multiple coding sessions.

```bash
# The basics
git worktree add <path> <branch>
git worktree list
git worktree remove <path>
```

---

_AI Disclaimer: This post was drafted with AI assistance._
