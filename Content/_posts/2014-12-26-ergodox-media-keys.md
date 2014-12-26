---
layout: post
title: Media Keys, Colemak, and the ErgoDox
description: Flashing the TMK firmware onto the ErgoDox.
date: 2014-12-26 19:55 +0800
---

I got an [ErgoDox off of Massdrop](https://www.massdrop.com/buy/ergodox) a few months ago, switching up from the Microsoft Sculpt Ergonomic Keyboard. It's an ergonomic, truly split keyboard (the two halves are joined by a cable so you can position them almost anywhere you want), with a feature that stood out to me: it's reprogrammable, being driven by a [Teensy](http://www.pjrc.com/teensy/) microcontroller.

Massdrop provides an online configurator which is fairly easy to use, and so when it arrived I loaded a [customized Colemak layout](https://www.massdrop.com/ext/ergodox/?referer=FK57F5&hash=379b20112e91aef3f0383a1e72d9f054) onto the keyboard. The only downside to this was that the tool is based on an older version of the firmware, and doesn't support media keys - volume up, down, play/pause, and so on.

This was something I sorely missed from the Sculpt Ergonomic Keyboard, since it meant having to switch into and out of Spotify just to play and pause music. It's definitely not a major problem, though it is still a step down from before.

Eventually, I came across the [TMK firmware port](https://github.com/cub-uanic/tmk_keyboard) (on the `cub_layout` branch), and decided to give that a shot.

...someday. This was about a month or two ago, when assignment deadlines and exams were looming. So I pinned the tab in Firefox, and left it there.

Today ended up being that day.

After forking the repo, the first thing I tried before making any changes was to just build the existing firmware and layout. I installed the AVR tools and ran the `make clean` command listed in the [instructions](https://github.com/cub-uanic/tmk_keyboard/blob/cub_layout/doc/build.md) from within PowerShell, only for `sh.exe` to repeatedly crash. 

Switching over to Command Prompt caused `mkdir.exe` to crash instead.

Instead of trying to figure out the cause of all that, I decided to just run everything from my Ubuntu VM instead. After installing the toolchain (`sudo apt-get install gcc-avr binutils-avr gdb-avr avr-libc avrdude`, as given [here](http://avr-eclipse.sourceforge.net/wiki/index.php/The_AVR_GCC_Toolchain)), the `make` commands ran without issue.

Next, I spent some time figuring out what I actually wanted each layer to have. I essentially wanted to just copy the existing layout I had, then add media keys to the function layer - what would usually be the left and right arrow keys would become previous and next track, while volume up and down would replace the up and down arrow keys. Space (on the right hand thumb cluster) would then be play/pause.

One difference between the TMK and base ErgoDox firmwares is the way in which layers are handled. The base ErgoDox firmware uses a stack to keep track of the active layers - the layer on top of the stack takes precedence over those below. You can do some neat things with this, like having "transparent" keys that "fallthrough" to lower layers, though I didn't bother. You can also push and pop layers in any order.

The TMK firmware, however, doesn't quite work the same way (or at least my understanding of it is it doesn't). There's still a layer stack, with higher layers taking precedence over lower ones, but the key difference is that you don't push or pop layers: instead, you enable or disable them entirely. That does mean it's a little less flexible than the stock firmware, though it does support some other cool stuff - for example, you can have keys which do one thing when tapped, and another when held.

And media keys, which is why we're here.

There are four layers I use: a Colemak base layer, a layer with function (and now media) keys, a NumPad layer, and finally a QWERTY (for gaming) layer. Because of the way TMK's stack works, I had to rearrange them so QWERTY came above Colemak, but below function and NumPad, which should always take precedence.

I also changed things slightly, changing the toggle for the function layer which I never used (since I had other keys that would activate the layer when held instead) to toggle the QWERTY layer instead, which freed up that key for Caps Lock (or Backspace in QWERTY).

That left me with [this layout](https://github.com/jcheng31/tmk_keyboard/blob/colemak/keyboard/ergodox/keymap_colemak.h). I opted to use no-ops instead of having keys be transparent in most cases, except on the function/media layer - the key "above" that which would be held down to toggle that layer needed to be transparent, or else the layer would end up being stuck on.

Running `make -f Makefile.pjrc colemak` from `/keyboard/ergodox` builds the actual `.hex` which can be loaded using the Teensy loader.

And now I have media keys on my ErgoDox. Itch scratched.