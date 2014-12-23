---
layout: post
title: Building Less (CSS) in Sublime Text 3
description: A quick hack.
date: 2014-12-23 16:18 +08:00
---

[Less](http://lesscss.org/) is great. Having to manually compile it isn't.

In lieu of using something like [Grunt](http://gruntjs.com/) (which is probably a much better long-term solution), I came up with a quick Sublime Text [Build System](http://www.sublimetext.com/docs/build) to just stick in my project file and use. Triggering it from within a `.less` file passes that file to `lessc` and saves the result as a `.css` file in the same directory as the original.

Here it is:

```JSON
        {
            "shell_cmd": "lessc \"$file\" > \"${file/\\.less/\\.css/}\"",
            "selector": "source.less",
            "name": "LESS CSS"
        }
```

Sticking that in the `build_systems` array in `.sublime-project` causes it to show up under `Tools -> Build System`, and choosing Automatic should cause it to only trigger from within a `.less` file.

However:

* I only tested it on Windows. It doesn't seem like there would be any issues on other OSes, but I don't know that for sure either.
    - "Tested" means I ran it from within a `.less` file of mine and it correctly compiled and saved it as `.css`. So a pretty loose definition of "tested" here.
* It assumes your Less files are saved with `.less` as the extension. If they're saved as `.css.less` it'll (probably) still work, but...
* It outputs to the same directory, and just does a simple replacement of ".less" with ".css" in the file name. 
    - If you have `.css.less` files, they'll end up as `.css.css` files.
        + Probably.

I should just use Grunt. Or something.
