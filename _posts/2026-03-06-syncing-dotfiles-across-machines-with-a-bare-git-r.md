---
layout: post
title: "Syncing dotfiles across machines with a bare git repo"
date: 2026-03-06
tags: [tools, git, workflow]
excerpt: "A bare git repo lets you version your home directory config without the chaos of a .git/ folder in ~."
---

The problem with version-controlling dotfiles is structural: `git clone` puts a `.git/` folder inside the cloned directory. If you clone into `~`, git treats everything in your home directory as part of the repo. That's not what you want.

The workaround is a bare clone — just the git database, no working directory mixed in.

## How it works

A bare clone contains what would normally live in `.git/` (objects, refs, config), but nothing else. You store it at `~/.dotfiles` and tell git that `~` is the working tree:

```
~/.dotfiles/  <- git's database
~/            <- the working tree (where your .zshrc etc. actually live)
```

The `dotfiles` alias wires this together:

```bash
alias dotfiles='git --git-dir=$HOME/.dotfiles --work-tree=$HOME'
```

Because there's no `.git/` in `~`, normal `git` commands don't accidentally pick up home directory files. Regular git still works normally inside actual repos like `~/workshed/`. You use `dotfiles` instead of `git` for anything touching your home directory config.

One more setting worth adding: `showUntrackedFiles no`. Without it, `dotfiles status` lists every file in `~` that you haven't explicitly tracked — which is everything.

## New machine setup

```bash
# 1. Clone the git database (no working files yet)
git clone --bare git@github.com:your-user/home.git ~/.dotfiles

# 2. Create the alias (just for this session — .zshrc will restore it after checkout)
alias dotfiles='git --git-dir=$HOME/.dotfiles --work-tree=$HOME'

# 3. Pull tracked files into ~
dotfiles checkout

# If existing files conflict, back them up first:
#   dotfiles checkout 2>&1 | grep -E "^\s+" | xargs -I{} mv {} {}.bak
#   dotfiles checkout
# Or force overwrite:
#   dotfiles checkout -f

# 4. Suppress untracked file noise
dotfiles config status.showUntrackedFiles no

# 5. (Optional) Disable GPG signing if you haven't imported your key yet
dotfiles config commit.gpgsign false
```

After checkout, `.zshrc` provides the `dotfiles` alias permanently.

## Day-to-day usage

```bash
dotfiles status                       # what's changed
dotfiles diff                         # see actual changes
dotfiles add ~/.some-config           # stage a file
dotfiles commit -m "add some-config"  # commit
dotfiles push                         # sync to github
```

## Tracking a new file

```bash
dotfiles add ~/.new-config
dotfiles commit -m "track new-config"
dotfiles push
```

## Notes

- Only files you explicitly `dotfiles add` are tracked. Everything else in `~` is ignored.
- The bare repo at `~/.dotfiles` never creates a `.git/` in `~`.
- Any git subcommand works: `dotfiles log`, `dotfiles diff HEAD~1`, `dotfiles stash`, etc.
