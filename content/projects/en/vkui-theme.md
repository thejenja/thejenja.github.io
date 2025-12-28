---
title: "VKUI Theme"
description: "Port of modern VK design"
color: "#0077ff"
icon: "🔵"
slug: "vkui-theme"
type: "userstyle"
stage: "completed"
technologies: ["css", "vkui", "responsive-design"]
date: 2023-03-10
linksTop:
  [
    {
      "label": "GitHub",
      "href": "https://github.com/thejenja/vkuitheme",
      "icon": "github",
    },
  ]
---

# VKUI Theme: Forward to the Future

OpenVK was created as a museum of the old VKontakte design. **VKUI Theme** is a paradoxical project that takes this "museum exhibit" and dresses it in the most current, modern clothes of the official VK website.

## Design Reverse-Engineering

To create this theme, I had to study the **VKUI** design system in detail. I analyzed:

- Color palette (signature VK blue, gray backdrops).
- Specific spacing and grid.
- Icon style (Outline vs Filled).

The main task was to achieve an "uncanny valley" effect, where the OpenVK user forgets that they are not on the official vk.com site.

## "Birdsite-like UI"

Inspired also by the Mastodon and Twitter interfaces, I implemented a more compact and informative layout. Special attention was paid to mobile adaptation, as modern VKUI is primarily a mobile-first philosophy.

## Technical Implementation

The project required writing hundreds of lines of CSS. I had to completely hide old elements (`display: none`) and render new ones using pseudo-elements `::before` and `::after` to add icons and decorative elements that were not in the original HTML. It was a real battle with layout, where CSS was used to the limit of its capabilities for visual content transformation.

## Outcome

VKUI Theme is a bridge between generations. It allows lovers of alternative engines (OpenVK) to enjoy a familiar modern interface while maintaining the freedom and independence of a decentralized platform.
