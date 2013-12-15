---
layout: post
title: 4-bit Webther
date: 2012-05-15 14:32
comments: true
categories: [Projects]
---

4-bit Weather was something I started last semester break for fun - it was a simple .NET application that took in a [Yahoo! WOEID](http://developer.yahoo.com/geo/geoplanet/guide/concepts.html) and spat out four indicators of the weather conditions at that location: hot/cold, rainy/sunny, windy/still, and humid/arid.

While the basic (and let's face it, it is pretty basic) functionality was there, I didn't get around to developing it to a state where I'd consider it complete. You had to manually look up your WOEID somewhere else if you didn't know it, then plug it in (though thankfully once that was done the application would remember it for you) - ideally, you'd just type in a location, and the application would figure everything out on its own.

Anyway.

[4-bit Webther](http://ayulin.net/webther/index.html) is the same concept, rebuilt for an entirely different platform: the web. It took significantly less time to write (one and a half days, on and off) than 4-bit Weather did, in part because I'd used the Yahoo! Weather API before (which, as it returns an RSS feed, required some parsing) but switched to using [YQL](http://developer.yahoo.com/yql/) this time (which returns JSON instead: perfect and easy to work with in a JavaScript application.)

It's also a lot easier to use - if you allow it to (and your browser supports it), it uses HTML5 Geolocation to get your location. If not, just type the place you want a weather forecast for, and it'll look it up.

That's pretty much it. 4-bit Webther gives a glance-able overview of the weather: nothing more, nothing less. The only thing left would be to add a way to save preferences - the starting location, units (km/h and C versus mi/h and F), and the various thresholds used to determine what value each "bit" should have.
