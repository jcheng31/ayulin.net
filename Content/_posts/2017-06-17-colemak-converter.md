---
layout: post
title: Typing Secrets in the Open
description: Garbage out. Garbage in. Plaintext out.
categories: [Projects, ColemakConverter, .NET Core, C#]
---

I've been keeping a daily journal for quite a while now - 8 or so years? I started using OhLife, which was email-based, then when that shut down I moved to plain-old-Markdown files stored in a TrueCrypt (and now VeraCrypt) container... thing.

One thing I had never really done was journal in public, because that would mean anyone could just read whatever I wrote. If I had to, I'd try and put my back to a wall, and close the window whenever anyone got near. Earlier this week, though, I found myself with some time to go before a flight and wondered if there were a way I could actually write at the gate, in the open, without anyone being able to tell what I was writing.

I realised that I actually could, and that the method was really simple too.

Something I'd done a few years ago was switch over to using [Colemak](https://en.wikipedia.org/wiki/Keyboard_layout#Colemak) instead of QWERTY; I can touch type in it, too. If I were to switch my keyboard layout back into QWERTY but keep typing as if I were using Colemak, the result would be seemingly gibberish to anyone looking - I'd just need to convert the text back later. The same technique would work with any alternative keyboard layout with enough keys that differ from QWERTY, like Dvorak: it's effectively a simple [substitution cipher](https://en.wikipedia.org/wiki/Substitution_cipher), though instead of writing plaintext and encoding it, you just write the ciphertext directly.

I wrote my entry, then worked on a tool to decode it. So here's [ColemakConverter](https://github.com/jcheng31/ColemakConverter).

It:

* Is written in C#, using .NET Core.
  - I really like C#.
* Is cross-platform! Hooray!
  - Install .NET Core, add it to your PATH, then run `dotnet ColemakConverter.dll <path to input file> <path to output file>`
     - It's like Java, but not!
* Converts text written using QWERTY, but as if the keyboard layout was Colemak, back into plain text.
  - In other words: set your keyboard layout to QWERTY, type as if you were using Colemak, and this tool will convert the result into a readable form.
* Does not have any error-handling whatsoever.
  - Forget to give it either an input path or an output path? It'll crash.
  - Give it an input path that points to something that isn't a text file? It'll probably crash.
      - I didn't actually try. But the chances are pretty good.
* Probably won't scale well to massive files.
  - Here's how it works:
     1. Read all lines from the input file.
     2. For each line, split the text into characters, convert each character, then join the converted characters into a converted string.
     3. Write all lines into the output file.
  - Let's do everything in memory! \o/

Could it be more efficient? Sure. Safer? Definitely. More general, with a file used to define the character mapping, so it's not just hardcoded for QWERTY and Colemak? Yeah. But this seems so incredibly niche that I doubt there's actually any demand for it.

But if I'm wrong, feel free to file an issue or submit a pull request!
