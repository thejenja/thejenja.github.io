---
title: "FluentOVK"
description: "Theme in Windows 11 Fluent Design style"
color: "#0078d4"
icon: "💠"
slug: "fluent-ovk"
type: "userstyle"
stage: "completed"
technologies: ["css", "backdrop-filter", "fluent-design"]
date: 2023-02-15
linksTop:
  [
    {
      "label": "GitHub",
      "href": "https://github.com/thejenja/fluentovk",
      "icon": "github",
    },
  ]
---

# FluentOVK: Windows to the Future

With the release of Windows 11, the design world was taken over by the **Fluent Design** concept: translucency (Mica/Acrylic), blur, depth, and light. I asked myself: is it possible to bring this native desktop experience to a social network's web interface? The answer is **FluentOVK**.

## Acrylic and Glass

The main feature of the theme is the use of modern CSS filters.

- **`backdrop-filter: blur()`**: The key technology. Sidebars, the site header, and pop-up windows received a frosted glass effect. The site background shines through the interface, creating a sense of depth and volume.
- **Gradients and Shadows**: Instead of flat colors, complex gradients and soft shadows (`box-shadow`) were used, imitating light sources characteristic of Fluent UI.

## Implementation Challenges

Browsers don't always render heavy blur effects perfectly, especially over large areas. One of the main tasks was performance optimization. I had to find a balance between the beauty of "acrylic" and FPS when scrolling the feed.

Also important was adhering to Microsoft guidelines. I studied the Fluent UI documentation to copy the exact corner radii (4px, 8px) and press animations that visually "press" elements into the screen depth.

## Outcome

FluentOVK is an attempt to blur the line between a website and a native Windows application. This is a theme for those who love the aesthetics of modern OSs and want to see it everywhere, even in the browser.
