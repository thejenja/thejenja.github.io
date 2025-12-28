---
title: "Kotle"
description: "Advanced Userscript for OpenVK"
color: "#ef4444"
icon: "🧩"
featured: true
slug: "kotle"
type: "userscript"
stage: "completed"
technologies: ["javascript", "tampermonkey", "dom-manipulation"]
date: 2025-01-22
linksTop:
  [
    {
      "label": "GitHub",
      "href": "https://github.com/thejenja/kotle",
      "icon": "github",
    },
  ]
---

# Kotle: Going Beyond CSS

If visual themes only change "cosmetics," then **Kotle** changes the rules of the game. It is a powerful JavaScript script (Userscript) that injects itself into the page code and modifies its behavior on the fly. Inspired by the legendary `VKify`, Kotle gives the user "god mode" tools unavailable in standard settings.

## JS Magic in the Browser

Kotle works through script managers like **Tampermonkey**. This allows arbitrary JavaScript code to be executed when the page loads.
What Kotle can do:

- **DOM Manipulation**: The script finds page elements (menus, buttons, blocks) and rebuilds them. Removes the unnecessary, adds the new.
- **Custom Verification Marks**: Want verification, but the administration won't give it? Kotle renders a checkmark locally using SVG injections.
- **Settings Panel**: I implemented a custom settings UI that embeds directly into the site interface, allowing functions to be toggled in real-time.

## Architecture

Writing userscripts is always working with the "living organism" of someone else's site. Classes may change, elements may load asynchronously. Therefore, Kotle actively uses `MutationObserver` to track changes in the DOM tree and react to dynamic content loading (SPA transitions).

## Significance

Kotle is a project for power users. It shows that the web is an open platform. Even if the site developers didn't provide a certain function, we can add it ourselves using JavaScript. This is a manifesto of user freedom in customizing their digital space.
