---
layout: post
title: 'The Invariant Culture is Your Friend'
description: "Commas and decimals often mix."
date: 2015-04-19 14:31 +08:00
---

Not every place in the world uses the full stop (or period) as a decimal mark. Quite a few use the comma instead.

Simple and perhaps obvious to some, though it's bitten me twice now. I first ran into it three years ago in [Fourcast]({% post_url 2012-07-14-Fourcast-0-4 %}) and fixed it there. More recently, the same thing came up again in [ForecastPCL](https://github.com/jcheng31/ForecastPCL/issues/5) - I'd completely forgotten about it. Hopefully writing this will help in remembering the problem in the future [[1]](#footnote-1).

Both Fourcast and ForecastPCL involve converting latitude and longitude coordinates (with their decimal point) to or from strings. Both rely on a web service which uses these coordinates with a full stop as the decimal. And both failed when the code ran on a device in a locale where the comma is the decimal mark instead.

The reason is simple: in .NET, both [`Double.ToString()`](https://msdn.microsoft.com/en-us/library/kfsatb94%28v=vs.110%29.aspx) and [`Double.Parse()`](https://msdn.microsoft.com/en-us/library/fd84bdyt%28v=vs.110%29.aspx) use the formatting conventions of the device's culture. So you're fine if your code runs on a system set to a locale with full stops as the decimal, but everything explodes elsewhere.

For instance, consider this example (using [scriptcs](http://scriptcs.net/)): we set the current thread to use `en-US`, a region where the period is the decimal mark.

{% highlight C# %}
> using System.Globalization;
> using System.Threading;
> Thread.CurrentThread.CurrentCulture = CultureInfo.CreateSpecificCulture("en-US");
"en-US"
> Double.Parse("0.04");
0.4
{% endhighlight %}

But if we switch to a region which uses commas instead - say, France:

{% highlight C# %}
> Thread.CurrentThread.CurrentCulture = CultureInfo.CreateSpecificCulture("fr-FR");
"fr-FR"
> Double.Parse("0.04");
Input string was not in a correct format.
{% endhighlight %}

In a less-contrived example, we can look at (a simplified version of) the problematic code from ForecastPCL:

{% highlight C# %}
public async Task<Forecast> GetWeatherDataAsync(double latitude, double longitude)
{
    string baseUrl = "/forecast/{0}/{1},{2}";
    
    var requestUrl = string.Format(baseUrl, this.apiKey, latitude, longitude);
    
    return await this.GetForecastFromUrl(requestUrl);
}
{% endhighlight %}

In this case, the formatting works - it just gives us an incorrect URL, leading to a bad request:

{% highlight C# %}
// Still in fr-FR.
> string.Format("/forecast/{0}/{1},{2}", "apikey", 37.8267, -122.423);
// Uh oh.
"/forecast/apikey/37,8267,-122,423"
{% endhighlight %}

The solution to all of these problems is to use the [invariant culture](https://msdn.microsoft.com/en-us/library/system.globalization.cultureinfo.invariantculture%28v=vs.110%29.aspx) - an English-associated but non-region-specific culture that's useful for formatting issues like this [[2]](#footnote-2). `String.Format` can take in an `IFormatProvider` as its first argument, which solves our problem:

{% highlight C# %}
// *Still* in fr-FR...
> string.Format(CultureInfo.InvariantCulture, "/forecast/{0}/{1},{2}", "apikey", 37.8267, -122.423);
// But now we get the result we want.
"/forecast/apikey/37.8267,-122.423"
{% endhighlight %}

Similarly, `Double.Parse` takes in `IFormatProvider`, though as its last argument:

{% highlight C# %}
// Again in fr-FR.
> Double.Parse("0.04");
Input string was not in a correct format.
> Double.Parse("0.04", CultureInfo.InvariantCulture);
0.04
{% endhighlight %}

Pretty simple, though it does mean it gets sprinkled throughout the code. An alternative might be to change the thread to use the invariant culture before doing any parsing, then changing it back to the native one after. This strikes me as being _really_ hackish and more of a workaround than an actual solution, though.

---

<a name="footnote-1"></a>[1] - I've lived in two countries that use commas as the decimal mark before - Indonesia and The Netherlands - though I don't remember actually ever having used it myself.

<a name="footnote-2"></a>[2] - When I read the GitHub issue - *[the] decimal separator in czech locale... is a "," [and] not "."* - my immediate thought was "oh, I should've used the invariant culture."