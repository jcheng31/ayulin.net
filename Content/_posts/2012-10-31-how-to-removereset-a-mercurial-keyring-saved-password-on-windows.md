---
layout: post
title: "How To: Remove/Reset a Mercurial Keyring-saved Password on Windows"
date: 2012-10-31 22:14
comments: true
---
Because I couldn't find this ANYWHERE, and only figured it out after stumbling across a post on how `mercurial_keyring` is bugged on Windows (and only stores one password).

So, if you're like me and accidentally typed the wrong repository password into Mercurial (again, on Windows, and with the keyring extension) only to have it seemingly permanently etched into stone...

1. Open Credential Manager (Control Panel -&gt; User Accounts and Family Safety -&gt; Credential Manager; or just search for it.)
1. Click Windows Credentials.
1. Under Generic Credentials, look for Mercurial.
1. Expand, and edit or remove as desired.

Done.
