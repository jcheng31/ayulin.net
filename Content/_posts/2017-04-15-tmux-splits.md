---
layout: post
title: Doing the Splits
description: Overthinking about tmux's split hotkeys.
categories: [tmux, Bash on Windows, WSL, Linux]
---

While trying to fall asleep, I ended up thinking about the key combinations used to create splits in tmux.

You know. As one does.

By default, you use `Ctrl-b %` to create a vertical split (i.e. two panes side by side). A horizontal split (one pane on top, one pane on the bottom) is `Ctrl-b "`. It seems a common remapping is to change these to `Ctrl-b |` for vertical, and `Ctrl-b -` (or `Ctrl-b _`, or both) for horizontal. These make more sense at first glance: | and _ look more like the end result more than % and " do. % kind of looks like two panes side by side, though it could also just be two panes stacked; " would definitely be two panes side-by-side, though.

So if it's not visual, what's the mnemonic for these defaults?

Oh. % splits the pane down the middle, and it's located in the middleish of the keyboard, almost splitting the two halves from each other. " splits across the pane, and it's on the middle row if you ignore the function keys. In between the top and bottom halves.

Alright. That'll do.
