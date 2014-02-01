---
layout: post
title: Version Control
description: Developing Office plug-ins for earlier versions than the one installed.
date:  2014-02-01 14:40 +08:00
---

I spent last December working on the narration and caption features for [PowerPointLabs](http://www.powerpointlabs.info) without actually working on the plug-in itself; everything was done in a separate project. Eventually, it came time to merge everything in.

Merging itself wasn't too difficult, since the components were neatly compartmentalised: it was pretty much just a matter of copying the files in and changing their namespaces. The only issue was with getting the project as a whole to work for both myself and the existing, main developer - I'd been using Visual Studio 2013 and Office 2013, while he was on Visual Studio 2010 and Office 2010.

The differences in Visual Studio version weren't an issue, as [you can still open VS2013 projects in 2010 if Service Pack 1 is installed.](http://msdn.microsoft.com/en-us/library/hh266747.aspx) The Office versions, however, proved to be a little more tricky (though thankfully, fairly easily resolvable.) By default, Visual Studio will automatically upgrade an Office project to use the installed version of Office if it is newer than that specified in the project. This doesn't affect the version of Office the plug-in itself will run in - that is, the version of Office targeted by the plug-in - though it does mean you'll run into some issues when trying to debug.

Here's how to fix them.

---

Assuming you haven't already upgraded the project (i.e. it still opens and can be debugged without issue on the system with the older Office version), you'll see something like this every time you try opening the project on the new system.

![](/blog/img/Misc/ppt-versions-1.png)

If you have already upgraded the project, you'll want to revert to before the point of upgrading - you did use source control, right? ;)

To prevent this, go to the `Tools` menu and hit `Options`, then navigate to `Office Tools\Project Migration` (or just search for it using the search bar there.) You'll see this option is checked by default:

![](/blog/img/Misc/ppt-versions-2.png)

Uncheck that, and Visual Studio will let you proceed without prompting you to upgrade. We aren't quite done, though - now the **newer** system will be the one to see this prompt when trying to debug:

![](/blog/img/Misc/ppt-versions-5.png)

To fix this, you'll need to edit the project's properties. Go to the `Project` menu, and click the `<Project Name> Properties` item, then click on `Debug` in the left pane.

![](/blog/img/Misc/ppt-versions-3.png)

You'll want to change the `Start Action` to `Start external program`, then set it to launch the Office program executable you have installed; in my case here, that was just PowerPoint.

![](/blog/img/Misc/ppt-versions-4.png)

And there you go. This is a user-specific setting, so as long as you don't have your `.suo` and `.csproj.user` files tracked in source control, it won't affect any other system.