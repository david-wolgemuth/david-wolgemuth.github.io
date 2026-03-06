---
layout: post
title: "The Alias You Didn't Know Was a CLI"
date: 2026-03-06
tags: [design-patterns, tools, complexity]
excerpt: "Most dotfile managers are wrappers around git with different flags. The interesting question is how many other dependencies follow the same pattern."
---

## The Pattern

A surprising number of developer tools are thin wrappers around existing commands with different default arguments. The wrapper adds a name, a README, maybe a config format — but the underlying operation is often one flag away from something already installed.

The default posture is to reach for `brew install`. Sometimes the answer was `alias` the whole time.

## Example: Dotfiles

The standard problem with version-controlling dotfiles: `git clone` puts `.git/` inside the target directory. Clone into `~` and git claims your entire home directory. Tools like chezmoi, yadm, and GNU Stow exist to solve this.

A bare git repo solves it in six words:

```bash
alias dotfiles='git --git-dir=$HOME/.dotfiles --work-tree=$HOME'
```

That's the whole tool. `--git-dir` tells git where to keep its database. `--work-tree` tells it where the actual files live. Because there's no `.git/` in `~`, regular `git` commands inside `~/my-project/` work normally. You use `dotfiles` for home directory config.

```bash
dotfiles add ~/.zshrc
dotfiles commit -m "update zshrc"
dotfiles push
```

New machine setup is a bare clone, one checkout, done. The README for this "tool" is essentially the alias itself — which is also, coincidentally, the entire source code.

Compare that to chezmoi's documentation. The ratio of docs-to-capability tells you something about how much abstraction you're carrying.

## What the Wrapper Buys You (Sometimes)

This isn't an argument that wrappers are always wrong. Chezmoi handles templating — machine-specific config variants, secrets injection, one-command apply across divergent hosts. If you manage 30 machines with different OS-level quirks, the abstraction pays for itself.

But most developers manage one to three machines with nearly identical configs. For that case, the bare repo alias does everything needed. The dependency exists to solve a problem that often hasn't actually materialized.

```
┌────────────────────────────┬──────────────────────┬─────────────┐
│ Approach                   │ Handles              │ Costs       │
├────────────────────────────┼──────────────────────┼─────────────┤
│ alias + bare repo          │ versioning, sync     │ one alias   │
│ chezmoi                    │ + templating, secrets│ new CLI,    │
│                            │   multi-OS variants  │ config fmt, │
│                            │                      │ mental model│
│ stow                       │ + explicit symlinks  │ directory   │
│                            │                      │ conventions │
└────────────────────────────┴──────────────────────┴─────────────┘
```

## The Broader Question

Dotfiles are the clean example. The murkier one: how many other tools in a typical dev environment follow the same shape?

A few candidates that tend to surface:

- **Directory-scoped shells** — tools that set environment variables when you `cd` into a project. `direnv` does this well. But `cd() { builtin cd "$@" && [ -f .env ] && source .env; }` covers a surprising percentage of the use case. (It covers it worse, to be fair — no cleanup on exit. But it covers it.)

- **Process runners** — Procfile managers, task runners, `make` wrappers. Many exist because `make` has confusing syntax, not because the problem is hard. The dependency solves an ergonomics gap, not a capability gap.

- **Git workflow tools** — aliases around `git log --oneline --graph`, `git stash` patterns, branch naming conventions. Some of these accumulate into a tool (git-flow, lazygit). Whether the tool is worth it depends on whether you've outgrown what `[alias]` in `.gitconfig` can express.

The pattern in each case: an existing tool handles the core operation. The wrapper adds defaults, guardrails, or a nicer interface. The question isn't "does the wrapper help" — often it does — but "could I articulate what I'm paying for?"

## Where This Breaks Down

Aliases stop scaling when the logic exceeds a single command invocation. Once you need conditionals, error handling, or state across calls, you've graduated from alias to script to tool. The boundary is blurry but real.

The honest test: if you can't write the alias from memory on a fresh machine, it's not simple enough to stay an alias. And if you find yourself maintaining a shell function longer than ~15 lines, you've quietly built the tool you were trying to avoid — just without tests or documentation.

(There's a certain recursive irony in version-controlling a shell function that manages your version-controlled shell functions.)

---

*This post was written with AI assistance.*
