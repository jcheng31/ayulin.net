---
layout: post
title: That Fourcast Crash Bug
date: 2012-12-29 18:32
comments: true
categories: [Fourcast, Projects]
---
If you’ve upgraded from Fourcast v0.6 to v0.7 and

1. Fourcast is set to load your Home Location on launch; OR
1. Fourcast is set to load the previously viewed location on launch

The app will crash on launch. **To fix this (without having to wait for v0.8), uninstall and reinstall the app** – really sorry!

If you’ve set Fourcast to load your current location on launch (and have upgraded from v0.6 to v0.7), you’re good to go and **don’t** need to reinstall.

This post is basically to explain what went wrong and why: a really silly oversight.

# Background

<div style="text-align: center;"><img src="/blog/img/Fourcast/Crash/Fourcast-1.png" /></div>

Fourcast v0.7 is, from the user’s perspective, a maintenance release. There’s only one “new” thing: updating the resolution of the app’s Live Tiles so they don’t [look all pixelated](https://twitpic.com/bkp20y) on Windows Phone 8 (and eventually, 7.8) devices.

Everything else was entirely behind the scenes. A bug fix, removing a useless reference, and a replacement of a (pretty clunky) way of doing things with a new, streamlined method.

Oh, and refactoring pretty much the entire core of the application so it actually followed a proper design pattern. This was something I’d wanted to do for a while, but hadn’t had the time to until now then. The end goal of this was to do things “properly” (or at least “more properly” than it was before, if such a notion even exists), and also to make the app easier to maintain and add to in the future.

Since the entire point of refactoring is to improve the code without (in short) breaking anything, Fourcast v0.7 should’ve gone out onto the Store without any real noticeable differences. Everyone should have been able to update to the newest version of the app and keep using it without the way they always did.

# What Actually Happened
Things broke. Crash report emails started coming in, each exactly identical.

There was clearly an issue with v0.7, but it only seemed to affect those who’d upgraded from v0.6; this was deduced from the issue not appearing on my own device, which I had recently replaced and hence hadn’t run v0.6 on, as well as the absence of reports from WP8 users who had discovered Fourcast after v0.7 launched.

## Breakdown
Here’s an example of a crash report email, with the stack trace for this issue. (These emails are incredibly useful, since they: a) let me know there is an issue somewhere; b) flag where the issue started. They’re not perfect since I can’t see the exact state of the application when the crash occurred, but at least there’s a start point.)

<div style="text-align: center;"><img src="/blog/img/Fourcast/Crash/Fourcast-2.png" /></div>

We can tell pretty easily from the stack trace that the app is crashing on launch, since the `HandleApplicationStart` method is right there. The issue seems to occur only when it tries to retrieve weather (`WeatherEngine.GetWeather`), and only when the app is doing so for a previously saved location (`MainPage.LoadWeatherFromPreferences`).

The `WeatherEngine` component is responsible for actually connecting to Weather Underground, pulling weather data from it, and parsing it for display. It needs what is essentially the identity of the weather station it should be getting data from to do this, which is known as the **query link** – this is passed to the component when it’s first initialised.

When Fourcast launches, it checks what it should do based on its Settings: if it should locate the user and get weather for that location, retrieve weather for the last location that was viewed, or retrieve weather for the Home Location (assuming one was set.) For the first option, no query link is needed as Weather Underground accepts a latitude and longitude instead of a query link.

For the latter two options, the app retrieves the appropriate query link (which was previously saved), then tries to get weather using it. If the WeatherEngine is told to retrieve weather when it hasn’t received a query link, it throws the exception we’re seeing here.

The problem is a result of how the query link was stored, and some of the changes made in v0.7.

# Why It Happened
Fourcast uses an extremely primitive method of storing data – instead of saving weather information in a database for later retrieval, it simply uses the app’s [Isolated Storage file](http://msdn.microsoft.com/en-us/library/windowsphone/develop/system.io.isolatedstorage.isolatedstoragesettings.applicationsettings) and saves weather data there.

Query links are nested inside the weather data objects that are written to Isolated Storage, and not stored as a separate “entry”. From a design perspective this made some sense, as it would be useful to take a weather object and be able to retrieve updated data for the same location by just “asking” the object what its query link was. So when Fourcast launches it retrieves the stored weather objects (which is how the app can display weather it had loaded the last time it was run – this happens in `LoadWeatherFromPreferences`), pulls the query link from them, and tries to get updated weather data.

The whole reason this took so long to figure out was basically because I’d been looking in the wrong place for the wrong things. In the process of refactoring everything, chunks of code got shifted between files to make more logical sense (and several things were partially rewritten) – I’d basically assumed that the query link wasn’t being saved properly, and was searching for the point where this was the case.

Here’s the real cause of the issue, a change to the weather object which was carried out months ago when I first started working on v0.7. Thanks to version control, it was extremely obvious where the problem was… once I actually looked in the right place.

<div style="text-align: center;"><img class="aligncenter size-full wp-image-75" alt="Fourcast 3" src="/blog/img/Fourcast/Crash/Fourcast-3.png" /></div>

Most of the variables here were renamed so they actually followed standard naming conventions, which basically broke everything. The weather objects saved under v0.6 were still retrievable in v0.7, but were unusable since they were essentially a blank slate (as the saved data didn’t match the new variable names, and so everything defaulted to their uninitialized values).

Because these “blank” objects were still retrievable, Fourcast didn’t see anything out of the ordinary and tried to retrieve weather using what was stored in the QueryLink variable. Which was nothing: null. And so the WeatherEngine crashes the app.

(When the renaming was carried out, all references in the rest of the app were updated to use the new names as well. This is why the app works normally if v0.7 was clean-installed – there’s essentially no change in this scenario.)

# What’s Been Done
In v0.8, the app doesn’t just blindly pass the query link reference to WeatherEngine any more – it checks if there’s actually a query link first, then lets you search for a location if there isn’t (as opposed to just crashing the app, which since the issue occurred on application launch lead to an endless cycle of crashing.) This handles the situation here (tested by deploying v0.6, running it, then deploying v0.8), as well as any other scenarios where this might happen.

# Wrapping Up
To reiterate: **uninstalling and reinstalling** the app will resolve this issue, since it’s caused by v0.7 essentially being incompatible with saved data from v0.6. This only applies to users who have upgraded from v0.6 to v0.7, and have set Fourcast to load weather for either the last location viewed, or the Home Location upon launch.

Users who have installed v0.7 without using v0.6, or those who have Fourcast set to locate them upon launch **do not need to do anything**.

Thanks to everyone who sent in crash reports. I’m sorry this issue even occurred, and for any trouble it caused.
