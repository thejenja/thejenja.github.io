---
title: "Portfolio"
description: "Personal frontend developer portfolio"
color: "#6a537d"
background: "radial-gradient(100% 100% at 0% 100%, #45285d66 0%, transparent 100%), radial-gradient(100% 100% at 100% 0, #5c2d3a66 0%, transparent 100%), var(--bg-quaternary)"
icon: "🎨"
featured: true
slug: "portfolio"
type: "website"
stage: "completed"
technologies: ["nuxt", "vue", "gsap", "scss", "simple-icons"]
github: "https://github.com/thejenja/thejenja.github.io"
demo: "https://thejenja.github.io"
date: 2025-08-11
gallery: ["/projects/portfolio/logo.svg", "/images/waving-hand.svg"]
linksTop:
  [
    {
      "label": "Telegram",
      "href": "https://t.me/thejenja",
      "icon": "telegram",
    },
    {
      "label": "GitHub",
      "href": "https://github.com/thejenja",
      "icon": "github",
    },
  ]
linksBottom:
  [
    { "label": "Figma", "href": "https://www.figma.com/@thejenja" },
    { "label": "Behance", "href": "https://www.behance.net/thejenja" },
    { "label": "Dribbble", "href": "https://dribbble.com/thejenja" },
  ]
---

# My Portfolio: A Developer's Business Card

A developer's portfolio is more than just a list of works. It is a real-time demonstration of skills, a "sandbox" where one can experiment with technologies that aren't always appropriate in corporate projects. **"My Portfolio New"** is the quintessence of my experience in Frontend development, combining a strict engineering approach with creative freedom.

## Cutting-Edge Technologies: Nuxt 4 and TypeScript

I didn't look for easy ways and chose the most modern stack: **Nuxt.js 4** (beta/latest) combined with **Vue 3** and **TypeScript**. This decision ensured strict typing of the entire project, from components to configuration files, eliminating many potential errors. The architecture is built on the use of _Composables_—all logic (animations, SEO, data handling) is moved to separate modules, leaving components clean and readable.

Special attention was paid to content. Thanks to **Nuxt Content**, project management is implemented via Markdown files. This allows updating the portfolio by simply adding a new `.md` file, without needing to dig into the code.

## Physics and Animation: GSAP

The main feature of the site is the sense of tactility. I used the **GSAP** library to create complex scenario animations. But simply moving elements is boring, so I added interactivity. The "activity" tags on the main page are draggable elements with return physics. You can scatter them around the screen, and they will smoothly, with inertia, return to their places. It is a small detail that makes the user linger on the site and "play" with the interface.

Page transitions, content appearance, and parallax effects—everything is tuned to run smoothly (60 FPS) thanks to the use of the `will-change` property and rendering optimization.

## Design and Internationalization

The visual style is minimalism with deep accents. Gradient backgrounds create depth, while responsive typography ensures readability on any screen. The site fully supports dark and light themes, automatically adjusting to the user's system settings, but leaving the option for manual switching.

The project is designed for an international audience, so full multilingual support is implemented via **Nuxt i18n**. Language switching happens instantly, without reloading the page, while preserving context.

## Conclusion

This project is my statement of quality. There are no random decisions here. Every animation, every line of TypeScript code, and every SCSS mixin serves one goal: to show that the modern web can be fast, beautiful, and technologically advanced at the same time.
