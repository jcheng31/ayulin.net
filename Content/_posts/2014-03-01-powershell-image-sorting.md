---
layout: post
title: Sorting Images with PowerShell
description: An incremental journey.
date: 2014-03-01 20:54:56 +08:00
---

I've accumulated quite a number of wallpapers over the last few years; close to two thousand images totalling almost 3.5 GB and counting, in fact. They came from a whole hodgepodge of places online, in various sizes and aspect ratios, and I have them in my ~~Sky~~OneDrive folder so they get synced across my desktop and laptop.

My old desktop monitor was had a resolution of 1680 by 1050, a 16:10 aspect ratio. My recent laptops have had 1080p (16:9) screens. Eventually, I ended up getting a 16:9 screen for my desktop as well.

I wrote some PowerShell scripts to go through my wallpaper collection and grab higher resolution replacements where they were available, though that still left me with a large number of images that weren't replaced. Those scripts also only targeted one particular wallpaper site, too - everything else was left untouched.

And so the image displayed on my desktop would, depending on its size and aspect ratio, fall into one of a few categories:

1. A 16:9 image that would display nicely.
1. An image at an odd aspect ratio close enough to 16:9 to display well.
1. An image at 16:10 that would be pillarboxed.
1. An image at some other squarish resolution that would be pretty much centred on the screen.

This lasted until today, when I decided that instead of revising or working on assignments, I'd sort this minor irritation out. 

Priorities.

---

The train of thought that lead to writing this script went roughly as follows:

1. I need to figure out which images aren't 16:9, then move them into a folder so I can archive them.
1. I should use PowerShell to do it! Because that'd be cool, right?
1. Hang on, there's probably a program that does this kind of thing already, in much less time than it'd take to figure these things out.
1. But that wouldn't be much fun.

Again: priorities. >.>

---

# Initial Commit.

So let's do it.

The first version is pretty simple - more of a proof of concept. I'm using the full cmdlet names here, whereas you'd probably use an alias instead if you were to actually type things out in the shell (for example, `Get-ChildItem` becomes `gci`, the DOS-style `dir`, or the UNIX-friendly `ls`.)

{% highlight powershell %}
foreach ($item in Get-ChildItem | Where-Object Extension -In ".jpg", ".bmp", ".png") {
	$image = New-Object System.Drawing.Bitmap $item.FullName
	$aspectRatio = $image.Width / $image.Height
	
	if ($aspectRatio -ne 16/9) {
		Write-Host $item.Name
	}
}
{% endhighlight %}

Or, in English:

>For each file in the current directory which has a .jpg, .bmp, or .png extension (i.e. images),

>1. Create a .NET `Bitmap` object to represent the image file,
1. Use that object's properties to calculate the aspect ratio of the image,
1. And if the aspect ratio is not 16:9, write the name of the file.

And it works! So far so good.

---

# Category 2

So this catches stuff that falls into categories 2, 3, and 4 above. But category 2 images still display fairly well - what if we added some tolerance?

{% highlight powershell %}
$upperLimit = 16/9 + 0.05
$lowerLimit = 16/9 - 0.05

foreach ($item in Get-ChildItem | Where-Object Extension -In ".jpg", ".bmp", ".png") {
    $image = New-Object System.Drawing.Bitmap $item.FullName
    $aspectRatio = $image.Width / $image.Height

    if ($aspectRatio -gt $upperLimit -or $aspectRatio -lt $lowerLimit) {
        Write-Host $item.Name
    }
}
{% endhighlight %}

So instead of checking for strict equality with 16:9, we allow for a little bit of leeway on either side. We can tweak the amount of tolerance later if needed (0.05 was picked just because it'd let some images I already know look decent slip through.)

---

# Drip. Drip.

At this point, I switched working directories from my root wallpaper folder containing just ninety-one files to one of the subfolders which had just over ten times that amount. The script worked fine, though the rate at which file names were displayed very obviously started to decrease after some time.

While trying to figure out why, I noticed PowerShell was now using over three hundred MB of memory.

Oops.

{% highlight powershell %}
$upperLimit = 16/9 + 0.05
$lowerLimit = 16/9 - 0.05

foreach ($item in Get-ChildItem | Where-Object Extension -In ".jpg", ".bmp", ".png") {
    try {
        $image = New-Object System.Drawing.Bitmap $item.FullName
        $aspectRatio = $image.Width / $image.Height

        if ($aspectRatio -gt $upperLimit -or $aspectRatio -lt $lowerLimit) {
            Write-Host $item.Name
        }
    } finally {
        $image.Dispose()
    }
}
{% endhighlight %}

*Try-finally*? Now we're looking even more like a program! (I think that's pretty cool.)

All we're doing now is just releasing the image object at the end of each iteration, once we're done with it. Using the `finally` block just ensures it'll always get released, even if something messes up (though nothing should (fingers crossed)).

That killed the memory leak, but didn't fix the slowdown. Some more investigation revealed one of the causes, which wasn't a bug or issue: the further "in" to the folder, the less files there were that got rejected. Still, even after modifying the script to output files that were acceptable, the rate of display still slowed down as time went on.

I decided to just ignore it.

---

# Grab everything.

It'd be nice if I could run this from the root wallpaper directory, instead of having to go inside each individual subfolder. It'd also be great if the script would automatically move the "rejected" images into an appropriate subfolder, instead of just spitting out their names.

That means I need to recursively go through all the subfolders, and I need to know the folder of each rejected image. Both turned out to be pretty easy to do.

{% highlight powershell %}

$upperLimit = 16/9 + 0.05
$lowerLimit = 16/9 - 0.05

foreach ($item in Get-ChildItem -Recurse | Where-Object Extension -In ".jpg", ".bmp", ".png") {
    try {
        $image = New-Object System.Drawing.Bitmap $item.FullName
        $aspectRatio = $image.Width / $image.Height

        if ($aspectRatio -gt $upperLimit -or $aspectRatio -lt $lowerLimit) {
            Write-Host $item.Name "in" $item.Directory.Name
        }
    } finally {
        $image.Dispose()
    }
}
{% endhighlight %}

As the name implies, adding the `-Recurse` parameter tells `Get-ChildItem` to go through all subfolders as well. File objects also conveniently have a `Directory` property, which (of course) has a `Name` property.

Almost there.

---

# Move it.

Now that we can get all the files we want, it's just a matter of moving them to the appropriate folder. The desktop seems like a good place to put things.

Well, maybe not. It's convenient, though.

{% highlight powershell %}

$upperLimit = 16/9 + 0.05
$lowerLimit = 16/9 - 0.05

foreach ($item in Get-ChildItem -Recurse | Where-Object Extension -In ".jpg", ".bmp", ".png") {
    try {
        $image = New-Object System.Drawing.Bitmap $item.FullName
        $aspectRatio = $image.Width / $image.Height

        if ($aspectRatio -gt $upperLimit -or $aspectRatio -lt $lowerLimit) {
            $destinationFolder = $HOME + "\Desktop\Archive\" + $item.Directory.Name
            if (!(Test-Path $destinationFolder)) {
                New-Item $destinationFolder -ItemType Directory -WhatIf
            }
            Move-Item $item.FullName $destinationFolder -WhatIf
        }
    } finally {
        $image.Dispose()
    }
}
{% endhighlight %}

So now we construct the path to the desired folder (stored in `destinationFolder`), check if it exists, and create it if it doesn't. We then move the image to that folder.

That's the plan, anyway: with the `-WhatIf`s in place, all this does is tell us what operations would be carried out. A risk-free trial run of sorts.

---

# Bzzt.

Except that didn't quite work. Removing the `-WhatIf`s and running the script resulted in a whole bunch of errors appearing: *The process cannot access the file because it is being used by another process.*

Oh.

At first I thought it might have been because of the `foreach`-loop, though searching online for solutions didn't reveal anything.

Then I realised it might just be because of the `Bitmap` object. To test it out, I moved the if-statement outside the `try-finally` block:

{% highlight powershell %}

$upperLimit = 16/9 + 0.05
$lowerLimit = 16/9 - 0.05

foreach ($item in Get-ChildItem -Recurse | Where-Object Extension -In ".jpg", ".bmp", ".png") {
    try {
        $image = New-Object System.Drawing.Bitmap $item.FullName
        $aspectRatio = $image.Width / $image.Height
    } finally {
        $image.Dispose()
    }

    if ($aspectRatio -gt $upperLimit -or $aspectRatio -lt $lowerLimit) {
        $destinationFolder = $HOME + "\Desktop\Archive\" + $item.Directory.Name
        if (!(Test-Path $destinationFolder)) {
            New-Item $destinationFolder -ItemType Directory
        }
        Move-Item $item.FullName $destinationFolder
    }
}
{% endhighlight %}

It worked.

Sweet.