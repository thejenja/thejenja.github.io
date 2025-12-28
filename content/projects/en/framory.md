---
title: "Framory"
description: "Telegram bot for quick post creation"
color: "#0F0F0F"
icon: "🎭"
featured: false
slug: "framory"
type: "web-app"
stage: "in-progress"
technologies: ["vue", "telegram", "fabric", "typescript"]
date: 2025-07-14
linksTop:
  [
    {
      "label": "Telegram Channel",
      "href": "https://t.me/framory_app",
      "icon": "/icons/telegram-logo.svg",
    },
    {
      "label": "Telegram Bot",
      "href": "https://t.me/framory_bot",
      "icon": "/icons/telegram-logo.svg",
    },
  ]
---

# Framory: Creative Studio Inside a Messenger

In an era where content is created and consumed on the go, complex graphic editors often prove excessive. **Framory** is an ambitious project designed to solve this problem by bringing powerful visual creation functionality directly into the familiar Telegram interface. It is not just a bot, but a full-fledged WebApp (TWA) that blurs the line between native mobile software and web technologies.

## Concept and Solution

The idea of Framory is simple: give the user the ability to create a beautiful post cover, quote, or announcement in 30 seconds without leaving the chat. To realize this task, a modern stack based on **Vue.js 3** and **TypeScript** was chosen, ensuring code reliability and typing.

The key technical challenge was working with graphics. At the core of the editor lies the **Fabric.js 6.0** library, managing the HTML5 Canvas. This allowed implementing functionality comparable to desktop editors: layers, object movement, working with transparency, and vector shapes. But the magic lies not only in drawing but in optimization. Using `OffscreenCanvas` and `ResizeObserver` guarantees that even when working with complex templates, the interface remains responsive and smooth.

## Deep Integration with Telegram

Framory is an example of what a modern Mini App should look like. The application doesn't feel like an alien site inside the messenger.

- **Haptic Feedback**: Every user action—pressing a button, moving an element—is accompanied by light tactile feedback, which significantly improves UX.
- **Theme Adaptation**: The application automatically reads the user's current theme (dark or light) and adjusts its palette, becoming a natural extension of the Telegram interface.
- **Inline Mode**: One of the "killer features" became the ability to generate content directly in the message input line using quick commands and templates.

## Intelligent Capabilities and AI

The project is not limited to simple image dragging. Automation elements are embedded in Framory. A smart template system recognizes context: just type keywords like `@news` or `@quote`, and the app will suggest the most suitable layout itself. Plans include further expansion of AI functionality to generate unique backgrounds and stylistic solutions on the fly.

## Architecture and Future

Under the hood, Framory hides a modular architecture with a clear separation of responsibility. **Pinia** manages the complex canvas state, and components are broken into logical blocks (toolbar, export layer, editor), which allows easy scaling of the project.

At the moment, Framory is in active development but already demonstrates huge potential. It is a tool that proves: you don't necessarily need a powerful computer and Photoshop to create professional content. A smartphone and a properly designed web application are enough.
