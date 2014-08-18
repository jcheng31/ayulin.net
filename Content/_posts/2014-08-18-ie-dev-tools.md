---
layout: post
title: Thanks, IE.
description: Cross-Origin fun.
date: 2014-08-18 21:59:00 +0800
categories: [Web, Development]
---

While updating [Is it on Spotify?](https://jcheng31.github.io/isitonspotify/) to use the new(ish) Spotify Web API, I ran into an issue when testing things out locally.

![](/blog/img/Misc/2014/08/ie-dev-tools-1.png)

The good old *Cross-Origin Request Blocked*. I seemed to remember having the same issue when first writing the app, though it was solved by just throwing jQuery at the problem. So why was it back now?

Even stranger, the problem only occurred when running locally. Everything worked fine when the app was served from GitHub Pages, which was the opposite of what I found when I searched online: everyone else seemed to only have issues after deploying to their server, despite things working locally.

I thought it had might somehow have something to do with the way I was hosting it locally - just using Python's `SimpleHTTPServer` - though switching to `node-serve` or even Jekyll's `serve` (heh) didn't make a difference.

After some more fruitless searching, I decided on a whim to fire up Internet Explorer 11 and check out the F12 Developer Tools (which are, funnily enough, no longer bound to the actual F12 key). That gave an interesting series of messages, instead of just the one that Firefox Aurora did:

![](/blog/img/Misc/2014/08/ie-dev-tools-2.png)

The second message - `Redirect was blocked for CORS request.` - was a little puzzling. Clicking on the `SEC7127` error code lead to [this page](http://msdn.microsoft.com/en-us/library/ie/dn423949), which had a pretty big hint:

![](/blog/img/Misc/2014/08/ie-dev-tools-3.png)

That was the light-bulb moment: when I'd updated the API endpoint URL in the code, I'd left out the protocol (just as I did when using the old Metadata API), and so the request would just end up using whatever the app had been loaded over: HTTPS when on GitHub Pages, and plain HTTP locally. It turns out that the Spotify API is served through HTTPS, though making a request to it over HTTP results in a "correction" by means of a redirect. 

A redirect that ended up being blocked for security reasons by the browser.

And so everything worked fine when deployed, but not locally.

The fix was simple - just changing the URL in the code to include HTTPS at the start. Getting there, though, took more time than I'd have liked.

Thanks, IE.