---
layout: post
title: 'Packaging Problem'
description: 'NuGet, .csproj, and build configurations.'
date: 2015-11-18 13:14 +08:00
---

Relatively recently, I started using the actual command-line tool for NuGet; previously, I'd been using the Package Explorer GUI to create packages for [ForecastPCL](https://github.com/jcheng31/ForecastPCL). The benefit of the command-line tool is that it automagically creates packages the "proper" way - I don't understand how things are supposed to be structured internally, with the subfolders whose names specify the platforms you're targeting, but I don't need to worry about that.

For now, at least. I'm sure I'll need to at some point in the future.

There's a simple gotcha that I missed when skimming the [NuGet documentation](https://docs.nuget.org/Create/Creating-and-Publishing-a-Package), though. I created a nuspec file by running `nuget spec` from within the folder where my `.csproj` was, edited it as desired, then ran `nuget pack <project>.csproj` to create the package. This works without any problems, and the end result was a package that I was able to upload just fine without any issues.

The problem, though, is that:
>By default, NuGet will use the default build configuration set in the project file (typically Debug).

This **is** stated in the documentation. How to fix it is also given there. I didn't see it, though, which meant that when someone tried to actually use the package in an app, [it failed certification](https://github.com/jcheng31/ForecastPCL/issues/12) because the package had included the binary built in Debug mode, and not Release.

The NuGet documentation gives two ways of addressing this. The first is to specify the build configuration you want to use when running the tool:
{% highlight powershell %}
nuget pack <project>.csproj -Prop Configuration=Release
{% endhighlight %}

The downside to this is you need to remember to do it every time, which I'd definitely forget. You could stick it in a build script, of course.

The other method is to modify the `.csproj` file and just change the default configuration there. That's easily done by opening it in a text editor and changing the line that looks like this:

{% highlight xml %}
{<Configuration Condition=" '$(Configuration)' == '' ">Debug</Configuration>```
{% endhighlight %}

To this:

{% highlight xml %}
<Configuration Condition=" '$(Configuration)' == '' ">Release</Configuration>
{% endhighlight %}

And that's that.