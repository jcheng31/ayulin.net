---
layout: post
title: "Installing Nokogiri on Windows, with Ruby 2.1.5"
description: "TL;DR: update RubyGems."
date: 2015-02-01 20:00 +08:00
---

This is a quasi-follow-up to my [previous post]({% post_url 2015-02-01-jekyll-3-beta-on-windows %}), where we looked at installing the new Jekyll 3 beta on Windows. I had to install the Nokogiri gem to get this site working again once that was done, and came across an issue.

It wasn't a crash or anything: after running `gem install nokogiri`, the installation seemed to go fine. It would, however, just sit at the following stage forever:

```powershell
> gem install nokogiri
Fetching: mini_portile-0.6.2.gem (100%)
Successfully installed mini_portile-0.6.2
Temporarily enhancing PATH to include DevKit...
Building native extensions.  This could take a while...
```

It turns out that the version of RubyGems that comes with the Ruby 2.1.5 installer is actually pretty old! It ships with version 2.2.2, while (at the time of this writing) the latest version is 2.4.5.

From Command Prompt or Powershell, just run `gem update --system` to update it. Once that's done, `gem install nokogiri` should complete pretty quickly.
