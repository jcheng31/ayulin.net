---
layout: post
title: "Is it on Spotify?"
description: "A simple answer for a simple question."
date: 2014-04-15 23:45
---

While at a café with some friends, I heard bits and pieces of a song over the stereo - [this song](https://www.youtube.com/watch?v=-bmp4QWzHak). It sounded pretty nice, so after finding out what it was (in a roundabout manner<a id="ref1" href="#footnote1">[1]</a>) I starred it on Spotify.

This probably won't come as a surprise, given the title of this piece: a week or so later, it disappeared from the service.

I was wondering if it'd been completely pulled from the catalogue (unlikely, since the same artist had other tracks which were still up), and if not, where in the world it was still available. I also knew that the Spotify [Metadata API](https://developer.spotify.com/technologies/web-api/) let you look up a track's information, which also included its availability.

I searched around for a bit, but couldn't find anything which would just take a track name, and tell you where it could be heard. I did come across this [Quora post](https://www.quora.com/Spotify/What-website-lists-Spotify-music-availability-per-country?) from 2012 which suggested calling the API directly in the browser:

![](/blog/img/Misc/2014/04/isitonspotify-1.png)

Which definitely works, but eh. It's not the most convenient thing to do.

So, one Saturday later, here we are: a website to do just that.
<a id="ref2" href="#footnote2">[2]</a>

![](/blog/img/Misc/2014/04/isitonspotify-2.png)

Type in a track, hit Enter, and get an answer.

![](/blog/img/Misc/2014/04/isitonspotify-3.png)

---

![](/blog/img/Misc/2014/04/isitonspotify-4.png)

You can also change tracks if the first search result wasn't the one you were looking for by clicking on the name (if it's underlined), and see the exact regions by clicking on the number.

It's not the prettiest, but at least it beats JSON ;) 

Check it out [here](https://jcheng31.github.io/isitonspotify/), and (if you want) poke around the code [here.](https://github.com/jcheng31/isitonspotify)

---

My initial guess was correct: the song hadn't actually been removed entirely, though it's only available in the US, Canada, and Australia. Other tracks are available in many more regions, though.

Wish I knew how these licensing things work.

---

<a id="footnote1" href="#ref1">[1]</a> We were far away enough and the ambient sound was loud enough that I wasn't confident that my phone would be able to identify it. I asked a friend if he happened to know what it was, and he walked over and asked someone he knew who worked there.

<a id="footnote2" href="#ref2">[2]</a> I'd also been looking for an excuse to try [knockout.js](http://knockoutjs.com/) - MVVM on the web? Sign me up.