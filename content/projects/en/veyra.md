---
title: "Veyra"
description: "Customizable browser start page with widgets"
color: "#34226a"
icon: "🔄"
featured: true
slug: "veyra"
technologies: ["vue", "wxt", "pinia", "vue-i18n", "css", "chrome-extension"]
date: 2025-04-13
stage: "in-progress"
type: "tool"
---

# Veyra: Your Ideal Start Page

Every time we open a new browser tab, we see either emptiness or forced content. **Veyra** returns control to the user. It is a browser extension that turns the start page into a personal command center. The project was born from the desire to combine aesthetics and productivity, creating a space that inspires work but does not overload with information.

## Modular Architecture and WXT

Developing browser extensions has its specifics. For Veyra, the **WXT** framework was chosen—a modern tool that significantly simplifies the creation of cross-browser extensions, providing a development experience similar to Nuxt. This allowed using the full power of **Vue.js 3** and Hot Module Replacement (HMR) directly in the browser context.

The application architecture is completely modular. Each widget (Weather, Clock, Notes, Links) is an isolated component that the user can turn on, off, or move. The state of widgets and settings is managed via **Pinia**, and data is securely stored in the browser's local storage, ensuring privacy—no personal data goes to external servers.

## Design and Customization

Veyra is about freedom of self-expression. The user is the main designer of their page.

- **Dynamic Backgrounds**: Support for complex CSS gradients with customizable colors, angles, and even animation speed. Solid colors, smooth transitions—everything is configured in a couple of clicks.
- **Drag & Drop**: Using the `vue-draggable` library, the user can arrange widgets however fits them best, creating their ideal layout.

## Internationalization

Veyra speaks your language. Thanks to **Vue I18n**, the interface is fully localized. This applies not only to the settings menu but also to date and time formats in widgets. The project was designed from the start with global audience scaling in mind.

## Outcome

Veyra demonstrates how web technologies can improve the daily browser experience. It is a project where technical complexity (WXT, State Management, Chrome API) is hidden behind an intuitive and beautiful interface. It’s not just "another new tab," it’s a tool for focus and aesthetic pleasure.
