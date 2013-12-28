---
layout: post
date: 2013-12-28 12:40 +08:00
title: A Two-Line, Prettier PowerShell Prompt with posh-git
description: Wrapping be gone. (For the most part.)
---

One day, some time ago, a friend commented on how lengthy my PowerShell prompt line was. I hadn't noticed it until that point, but he was completely right.

Check this out:

![](/blog/img/Misc/powershell-1.png)

That's a 1296-pixel wide window there (scaled down to fit here.) The prompt line is just over a thousand pixels long.

Yow.

The real cause of it is my preference for descriptive directory names - for example, including a module's full name instead of just its code. In any case, it'd be pretty nice if we could get the directory path on one line, with input going on the next.

In other words, what [cmder](http://bliker.github.io/cmder/) does for the Command Prompt, but for PowerShell. And while we're at it, why not get the same colours cmder uses as well?

(At the time of this writing, cmder doesn't include any tweaks for PowerShell. It seems the only thing blocking some from being included is their needing to be signed in order to run without needing to change PowerShell's Execution Policy.)

---

This is assuming we're working with PowerShell with [posh-git](http://dahlbyk.github.io/posh-git/) installed, in cmder. The steps are largely the same even if you aren't using cmder (since it just wraps the normal PowerShell prompt anyway), though they're a lot simpler if you don't have posh-git.

**There could be a better way to do this.** I'm not a PowerShell expert (or even "intermediate", if we misuse English a little), so this is pretty naive. I'm just mashing up [this](https://github.com/Shoozza/cmder/commit/73082c1ca15d18a003a751aca151a577035597de) with posh-git's default prompt.

Incidentally, if you're not using posh-git, the stuff in the `prompt` function of that link is pretty much all you need. 

Firstly, let's open up our PowerShell profile. Its location can be found by entering `$PROFILE` into the prompt and hitting enter, though it should be in `<Your User Name>\Documents\WindowsPowerShell\` by default.

Assuming you haven't changed anything, posh-git's default profile should be loaded near the top.

	# Load posh-git example profile
	. 'C:\tools\poshgit\dahlbyk-posh-git-8aecd99\profile.example.ps1'

Take note of the path (which may be different on your system), then comment or remove the lines - they won't be necessary, since we'll be initialising posh-git from within the main profile. Here's what we need to do that:

	# Load posh-git module. INSERT YOUR POSH-GIT PATH HERE.
	Import-Module 'POSH-GIT-PATH-HERE\posh-git'
	
	# Set up our prompt.
	function global:prompt {
	    $realLASTEXITCODE = $LASTEXITCODE
	
	    # Reset color, which can be messed up by Enable-GitColors
	    $Host.UI.RawUI.ForegroundColor = $GitPromptSettings.DefaultForegroundColor
	
	    Write-Host($pwd.ProviderPath) -nonewline -ForegroundColor Green
	
	    Write-VcsStatus
	
	    # Prompt on newline, with cmder colours.
	    Write-Host
	    Write-Host ">" -nonewline -ForegroundColor DarkGray
	
	    $global:LASTEXITCODE = $realLASTEXITCODE
	    return " "
	}
	
	# More posh-git init.
	Enable-GitColors
	Start-SshAgent -Quiet

---

Let's break it down.

	# Load posh-git module. INSERT YOUR POSH-GIT PATH HERE.
	Import-Module 'POSH-GIT-PATH-HERE\posh-git'

As the comment says, this imports posh-git. Replace `POSH-GIT-PATH-HERE` with the actual path to the folder containing posh-git - in my case, it was `C:\tools\poshgit\dahlbyk-posh-git-8aecd99`.
	
	# Set up our prompt.
	function global:prompt {
	    $realLASTEXITCODE = $LASTEXITCODE

	    # Reset color, which can be messed up by Enable-GitColors
	    $Host.UI.RawUI.ForegroundColor = $GitPromptSettings.DefaultForegroundColor
	
	    Write-Host($pwd.ProviderPath) -nonewline -ForegroundColor Green
	
	    Write-VcsStatus

Standard posh-git initialization, but with one change: `-ForegroundColor Green` outputs the directory path in green.

	    # Prompt on newline, with cmder colours.
	    Write-Host
	    Write-Host ">" -nonewline -ForegroundColor DarkGray

This is what actually moves the input to the next line. Feel free to replace the standard `>` prompt character with your own (cmder uses a lambda, but I like the >). We're also changing the colours to dark gray for the character.

		$global:LASTEXITCODE = $realLASTEXITCODE
	    return " "
	}
	
	# More posh-git init.
	Enable-GitColors
	Start-SshAgent -Quiet

This was unchanged from the stock posh-git profile. You might have `Start-SshAgent` commented out in yours, though - I have it here so I just need to enter my SSH key's password once after booting (instead of every time I want to push to a remote.)

---

And that's it.

![](/blog/img/Misc/powershell-2.png)

It's not any shorter, but it does look a little more pleasing. The path can still wrap onto the next line if it gets *really* long, but having input separate does make it a little cleaner. 