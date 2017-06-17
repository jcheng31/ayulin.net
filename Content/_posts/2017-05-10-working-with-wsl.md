---
layout: post
title: Working with WSL
description: Not there yet, but so promising.
categories: [Bash on Windows, WSL, Linux]
---

Bash on Ubuntu on Windows, or the Windows Subsystem for Linux (or WSL), is a little over one year old now, and still a mouthful to say. When it was announced, I tweeted:

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">If this Bash thing means I don&#39;t need to actually use OS X/Linux to do the things I use OS X/Linux for, that&#39;d be awesome.</p>&mdash; Jerome Cheng (@Ayulin) <a href="https://twitter.com/Ayulin/status/715219838243905536">March 30, 2016</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

Are we there yet? No. Not quite. It's still quite impressive, though, and we're a lot closer to it now than at launch.

---

We use macOS at work, with the exception of one guy who's rocking Ubuntu instead - there was another, but he recently left. It works.

I like Windows better. (Surprise.)

After WSL was announced, I grabbed the first Insider Preview build that included it, and tried replicating my work setup using it. It didn't work out - some things installed, but other things wouldn't. That there were rough edges was to be expected: it was the first beta release.

But it's been a year, and I've been wanting to give things another try. I installed the newest Insider Preview build again - the latest WSL improvements can only be found there - and gave it a shot. It's still in beta, but how had things changed?

> At the time I started, the Creators Update hadn't been released yet. The build I was using became the final one, and I'm still using it right now; I've not installed any Insider builds since.

## Shells and Terminal Emulators.

I use zsh with oh-my-zsh, and they both installed just fine. One thing that doesn't seem to work is oh-my-zsh's vi\_mode status display in powerlevel9k. It just doesn't show up at all, and I'm not sure why. The rbenv display _does_ work, though, and it doesn't for me on macOS. You win some, you lose some.

Other things that I haven't gotten working are getting custom fonts (so I can have a powerlevel9k-compatible font) and colour schemes (i.e. Solarized). You have to edit the registry (yes, really) to get custom fonts working in the stock Windows console, though the few that I tried didn't work. Custom colours also seems to be most easily done through the registry, though the [Solarized variant I found](https://github.com/neilpa/cmd-colors-solarized) isn't the best; it's mostly there, though there're some differences from what I have in iTerm 2 on macOS.

I originally used ConEmu, which _does_ have built-in custom font support and colour schemes, though it also comes with its own set of trade-offs. Its built-in Solarized themes aren't the same either, and I didn't poke at the settings enough to get mouse support for things like tmux working. I've not fully decided on whether to stick with the default console or use ConEmu, though I'm leaning towards the latter.

## Getting things running.

The stack we use is mostly Ruby, some Golang, and a smattering of CoffeeScript. Postgres is our DB, Redis is used here and there as a cache (or a DB, too), and RabbitMQ is used to glue things together and get information to where it needs to be. I'd need all of these running locally to be able to get work done.

Most of the services I touch right now are in Ruby, so that's what I tried first. I installed rbenv and ruby-install without issue, and was able to download and compile the Ruby versions I needed. This was one of the things that didn't work at launch, since there was a very low RAM limit on the WSL environment - evidently, it's been fixed since. Bundler installs fine, and I didn't have any issues `bundle install`ing anything.

By which I mean none that couldn't be resolved by some searching, and following the instructions as if I were actually using Ubuntu. Par for the course.

Next up was Postgres. I followed the [instructions](https://www.postgresql.org/download/linux/ubuntu/) to add its apt repository, then `apt install`ed it. It took some time to figure out how to actually start and run it (`pg_clusterctl` instead of just `pg_ctl` like I was used to on macOS), and some more fiddling with users, but it works.

RabbitMQ was easy: `sudo apt install rabbitmq-server`. Done. Unlike when I installed it with homebrew on macOS, though, I had to run `rabbitmq-plugins enable rabbitmq_management` to get the web interface working, but that worked too.

Redis was fairly straightforward, too. `git clone` the repository, and `make`. There were some `apt install`s to get the actual build tools, though I'd done those a while ago - `build-essential` is probably one. Everything compiles and runs just fine.

So all the dependencies are there, and I can run everything. Cool.

## Editors?

I use Visual Studio Code for its plugin support, and for its better performance compared to Atom; Sublime still beats both of them easily in the performance department, but its plugins aren't as nice.

There's something I call the "Vagrant problem", which WSL suffered from at the start. I tried using Vagrant a while ago, since it promised a lot of what WSL does: use your Windows-based tools, with the ability to run your code (and other dependencies) in Linux. It sounded great, and almost lives up to the promise. The issue is that although your host OS tools can edit files in the guest VM through a shared folder (or some other mechanism), they usually can't execute anything in the VM without fiddling. That means your Windows-based editor plugins can't talk to your Linux-based linters, and so on.

It's a similar story now with WSL. There's greater interop as part of the Creators Update in that you can run Windows programs from within the WSL environment and Linux binaries from outside too, though you still have the same issue with the editor plugins: out of the box, without tooling around, your editor's not going to talk to the tools in "Linux". In this case it's more an issue of support than a technical limitation - the editor and plugins recognise that they're running on Windows, and aren't aware of the WSL environment. In an ideal world, there would be a "WSL mode" in the editor which would automagically hook into WSL and get everything working, or at the very least the plugins would have support for WSL. I'm not familiar enough with the way VS Code (or any editor) works to know how hard this would be.

So. The situation's good enough for things like maintaining this site - there aren't any plugins I use for this which need to talk to tools inside WSL - but not good enough for work.

What can we do? Well, if we run an X Server in Windows, we can try to just run the Linux version of the editor. I did that with [VcXsrv](https://sourceforge.net/projects/vcxsrv/), and it works fairly well... with Sublime. Both VS Code and Atom fail to launch with some dbus issue which I couldn't get around. To be fair, running GUI apps **is not** what WSL was designed or intended to do - that it kind of works is a nice bonus, but also one that would be unnecessary (for me) if the aforementioned editor support were there.

I had to add some arguments to the VcXsrv shortcut to get Colemak working (`xkbmodel pc105 -xkblayout us -xkbvariant colemak`), and DPI scaling is an issue I haven't figured out yet. Windows handles the scaling by default, which makes everything the correct size but pixelated. Disabling scaling makes the text clear, but everything becomes tiny. I can bump the editor font size up in Sublime so code itself looks okay, but the UI remains way too small. Apart from that, it works great: all the plugins work out of the box, with no further hacking needed.

(This also wouldn't be an issue if my laptop didn't have a hiDPI screen.)

## Concluding Performance

It could be better. A lot better.

It's not terrible for things like Jekyll, and it's so much easier to get that up and running in WSL than it is on actual Windows that I've switched over to it entirely for this site. Actual work stuff runs significantly slower, though - running the test suite for one of our services takes about a minute or so in an Ubuntu VM (or on my work iMac), but upwards of ten in WSL.

Yikes.

I'm not really sure what the exact bottleneck is. The tests involve Postgres/Redis/RabbitMQ as well, so it's not solely Ruby executing, but even things which _are_ just Ruby running are slower - think half a minute instead of ten seconds.

In all, everything _works_, but slower than it would in a native environment. It's quicker to spin up a WSL terminal than a full VM, and it's way more battery-friendly, but running things takes more time.

That's the main reason I don't bother using it more for actual coding at work. I can SSH into our servers to fix things if they break, since that's fast enough, but the "test" part of the code-test cycle takes too long to feel practical. It could just be the combination of things we use in our stack, but it's still a problem. For now.

Hopefully one day it'll be just as good as native.