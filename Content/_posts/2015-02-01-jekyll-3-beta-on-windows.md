---
layout: post
title: 'Installing Jekyll 3 Beta on Windows'
description: "A little more effort for the bleeding edge."
date: 2015-02-01 19:44 +08:00
---

In a [previous post]({% post_url 2014-03-09-installing-jekyll-on-windows %}) I wrote about installing Jekyll 1.4.2 on Windows - at the time, the guide linked from the Jekyll site itself was way out of date. Happily, they've since updated to link to a [much better guide](http://jekyll-windows.juthilo.com/).

Still, Jekyll 3's first beta has just come out, and I wanted to give that a shot. I also couldn't get things working exactly according to the above guide, and had to fall back to Ruby 1.9.3 (instead of 2.0.0 like it recommends).

So, from scratch, here's how to get Jekyll 3 (beta 1) up and running on Windows. Steps 1 and 2 are pretty much the same as in the old guide, except we're using a newer version of Ruby.

## 1. Install Ruby (2.1.5)

Once again, we need to grab both Ruby and the Development Kit from [here](http://rubyinstaller.org/downloads/). **Jekyll 3 has dropped support for Ruby < 2**, so I went with the 64-bit Ruby 2.1.5 installer, as well as its DevKit.

I ticked just **Add Ruby executables to your PATH** this time. The default installation path is `C:\Ruby21-x64`, which I left untouched as well.

## 2. Install the Ruby Development Kit

The Ruby DevKit installer just extracts the development kit files, but they need to be kept somewhere permanent. I extracted them to `C:\Ruby21-x64\devkit` (creating the `devkit` folder in the process).

To actually install the development kit, open up Command Prompt or PowerShell, `cd` to the folder it's extracted to, then run `ruby dk.rb init` and `ruby dk.rb install`.

## 3. Fix SSL, the right way.

Out of the box, RubyGems runs into some SSL issues when you try to install anything:

```shell
ERROR: While executing gem ... (Gem::RemoteFetcher::FetchError)
    SSL_connect returned=1 errno=0 state=SSLv3 read server certificate B: certificate verify failed (https://api.rubygems.org/specs.4.8.gz)
```

According to various StackOverflow answers (the best source), this is because Ruby can't find a root certificate to trust. We can fix that by grabbing the same certificate bundle Mozilla uses, conveniently found [here](http://curl.haxx.se/ca/cacert.pem). I saved it in `C:\Ruby21-x64` as well.

We also need make sure Ruby knows about it. To do that, go to `Advanced system settings` (on Windows 8 and above, hit `Win + X` then `y`, then click the link on the left), click `Environment Variables`, and add a System Variable with `SSL_CERT_FILE` as the name and the path to the saved bundle file as the value (`C:\Ruby21-x64\cacert.pem` if you're like me.)

Why "the right way"? There were some "solutions" here and there that involved making RubyGems use HTTP instead of HTTPS. Just, no.

## 4. Install Jekyll

It took a little longer, but we can now install Jekyll itself. Run `gem install jekyll --pre`, which will pull down the Jekyll beta.

## 5. Install Python

Just as before, this step is mainly for code syntax highlighting - however, since `jekyll new` now uses it, I don't really think it's "optional" as it was before. We can get Python [here.](http://www.python.org/downloads/) I used Python 2.7.8, and left the default installation options.

**Alternatively**, you can choose to use rouge for syntax highlighting (which [seems to be the way forward](https://github.com/jekyll/jekyll/pull/3323), but doesn't seem to be the case out of the box right now.) Just add `highlighter: rouge` to your site's `config.yml`, and run `gem install rouge`.

## 6. (Optional) Stop `jekyll serve` complaining

At this point, Jekyll works just fine, but it'll complain when you run `jekyll serve`, saying to add `wdm` to your Gemfile to avoid polling for changes. We can just run `gem install wdm` instead, which fixes this globally.

**Whew.** It's a bit more involved than before, but at this point we're good to go.

There's a follow-up [here]({% post_url 2015-02-01-installing-nokogiri %}) which deals with installing Nokogiri, which I had to do since my existing site - this one - somehow needs it. It's not really part of what you need for a plain Jekyll install, though, so I'm not including it here.
