---
title: "Framory"
description: "Telegram bot for quick post creation"
color: "#0F0F0F"
icon: "🎭"
featured: true
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

# Framory

Modern Telegram WebApp for creating beautiful covers and posters using the latest Web APIs and Telegram capabilities.

## Project Description

"Framory" is an innovative Telegram WebApp that allows users to create professional covers, posters and graphic materials directly in the messenger. The project demonstrates how to combine the power of modern web technologies with the convenience of the Telegram platform, creating a unique user experience.

## Key Features

- **Telegram WebApp integration** - full integration with Telegram Bot API
- **Canvas editor** - powerful tool for creating graphics
- **Templates and AI** - ready-made solutions and content generation
- **Cross-platform** - works on all devices
- **Inline mode** - quick generation directly in chat

## Technologies

### Frontend

- **Vue.js 3** with Composition API for modern architecture
- **TypeScript** for type safety and better DX
- **Vite** for fast building and development
- **Pinia** for application state management

### Canvas and Graphics

- **Fabric.js 6.0** for HTML5 Canvas work
- **OffscreenCanvas** for improved performance
- **HTML2Canvas** for image export

### Telegram Integration

- **@telegram-apps/sdk** for WebApp API
- **Haptic feedback** for tactile feedback
- **Viewport management** for adaptive interface

### Modern Web APIs

- **View Transitions API** for smooth animations
- **Popover API** for native popup elements
- **Scroll-driven Animations** for interactive effects
- **ResizeObserver** for performance optimization

## Architecture

The project is built on modular architecture principles with clear separation of responsibilities:

### Application Structure

```
src/
├── components/          # Vue components
│   ├── EditorCanvas.vue    # Main editor
│   ├── InlineEditor.vue    # Quick creation
│   ├── ModernToolbar.vue   # Toolbar
│   └── ExportPanel.vue     # Image export
├── composables/        # Reusable logic
│   └── useTelegram.js      # Telegram WebApp API
├── stores/             # State management
│   └── canvas.js           # Canvas state
├── views/              # Application pages
│   └── EditorPage.vue      # Main page
└── types/              # TypeScript types
```

### Vue 3 Composition API

Using modern approach with `<script setup>` and Composition API:

```javascript
<script setup>
	import {(ref, computed, onMounted)} from 'vue' import {useTelegram} from
	'@/composables/useTelegram' const {(isReady, themeColors, hapticFeedback)} =
	useTelegram() const canvas = ref(null)
</script>
```

### Reactivity and Performance

- Automatic state synchronization
- Rendering optimization with ResizeObserver
- Lazy loading of components
- Caching of templates and resources
