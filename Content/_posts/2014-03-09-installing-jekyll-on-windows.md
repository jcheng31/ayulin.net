---
layout: post
title: 'Yet Another "How To Install Jekyll on Windows" Post.'
date: 2014-03-09 18:00 +08:00
excerpt: "It seems there's no shortage of these. (I guess this doesn't help in that respect either.)"
---

**Update (12th May 2014):** I came across [this](https://github.com/juthilo/run-jekyll-on-windows/) linked from within an issue on Jekyll's GitHub repository, which is much more up to date (and well-maintained) than this post.

---

It seems there's no shortage of these. (I guess this doesn't help in that respect either.)

I noticed a bunch of other guides (including [the one](http://www.madhur.co.in/blog/2011/09/01/runningjekyllwindows.html) linked from Jekyll's site itself) were fairly out of date, so here's my no-nonsense take on how to get [Jekyll](http://www.jekyllrb.com) up and running on Windows as quickly as possible.

> Well, okay, maybe with some nonsense. I've included some side comments in blockquotes like this. They aren't really part of the instructions, so feel free to skip them if you're in a rush.

> The motivation for writing this was because I had to do this twice recently: once on a new computer, and once on my existing one after clearing out the [PortableJekyll](http://www.madhur.co.in/blog/2013/07/20/buildportablejekyll.html) bundle.

> The bundle worked for the most part, though I ran into issues when trying to get Nokogiri installed. So I decided to just nuke it and start from scratch.

---

## 1. Install Ruby
Grab Ruby and the Development Kit from [here](http://rubyinstaller.org/downloads/). The site recommends Ruby 1.9.3, so I went with that; I'd tried 2.0.0 previously and ran into some issues.

In the Ruby installer, tick both **Add Ruby executables to your PATH** and **Associate .rb and .rbw files with this Ruby installation**. (The latter may not strictly speaking be necessary for Jekyll, but I suppose it's useful if you want to do Ruby development in the future.)

I left the installation path as `C:\Ruby193`. Wherever you put it, **make sure there're no spaces in the name.**

## 2. Install Ruby's Development Kit
The Ruby DevKit installer's actually just an archive extractor. The files it extracts need to be saved somewhere permanent, though: I created a `DevKit` folder inside `C:\Ruby193` and extracted them there.

To actually install it, just open up Command Prompt or PowerShell, use `cd` to navigate to the folder it's extracted to, then run `ruby dk.rb init` and `ruby dk.rb install`.

## 3. Install Jekyll
[**Jekyll 1.4.3 is broken on Windows.**](https://github.com/jekyll/jekyll/issues/1948) So we'll have to install 1.4.2.

Again in the shell of your choice (in any folder), run `gem install jekyll -v 1.4.2`.

> If you're reading this from *The Future!* where a newer version of Jekyll is out, `gem install jekyll` should work instead. The rest of the instructions here assume 1.4.2, though, so other things may not work.

> Sadface.

## 4. Fix `jekyll serve --watch`
I'm pretty sure this is broken out of the box for everyone, though most guides seem to treat it as an issue that only affects a few.

Thankfully, it's fairly simple to fix. Run `gem install wdm` and you're set.

> Some other guides say you have to edit a gemfile somewhere, but that doesn't seem to be necessary any more.

**If you're just interested in a simple blog or site, you're basically all set.** If you want code syntax-highlighting, though, read on.

## 5. Install Python
Grab Python 2.7.6 [here.](http://www.python.org/downloads/) I left the default installation options as is.

**And now you're done.**

> A number of guides go on to guide you through installing Pygments using Python's package manager, though this too seems to no longer be necessary. It appears that installing Jekyll now installs it as well, so Python's the only thing you need.

## One Last Error
It seems there's a `warning: cannot close fd before spawn` error that comes up after running `jekyll build` or `jekyll serve`, followed by `'which' is not recognized as an internal or external command,` `operable program or batch file.`

I don't have a solution for this, but it also doesn't seem to cause any problems - everything still builds and works properly. Other guides seem to indicate it's caused by an issue with Pygments, though the errors there also involve a `Liquid Exception` (which doesn't happen now.)