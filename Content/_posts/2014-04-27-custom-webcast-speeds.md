---
layout: post
title: Setting The Pace
description: "Custom speeds for IVLE's Silverlight-based webcasts."
date: 2014-04-27 14:30
---

For one reason or another (read: I have no idea why, but...), the few webcasts I've watched recently seem to work better when viewed faster than real-time. I’d download the MP4 version, open it up in VLC, and use the playback speed controls to speed things up anywhere from 1.1, on one occasion, 1.3 times the normal rate.

One course, however, doesn’t work well with this plan: the MP4 version opens up in a new window instead of downloading, and the audio plays while the image remains black. There’s probably a way to fix and/or work around this, but I’m not really interested enough to find it. :|

The Silverlight-based version works just fine, and it does let you customise the playback rate, though the default increments aren’t very fine-grained:

![](/blog/img/Misc/2014/04/webcast-speed-01.png)

That got me wondering how the speed was being set, and if I could simply change the values in the dropdown to ones which worked better.

![](/blog/img/Misc/2014/04/webcast-speed-02.png)

Essentially, yes, you can. Changing the `value` attribute of an option to anything you want does actually change the playback rate, though anything above 2 times real-time breaks the audio - I'm reasonably sure this won't affect a whole lot of people.

I went and adjusted the values (and labels for ease of use) to more comfortable ones:

![](/blog/img/Misc/2014/04/webcast-speed-03.png)

Perhaps a browser extension or bookmarklet to do this automatically would be useful for heavy webcast users (if it doesn’t already exist).