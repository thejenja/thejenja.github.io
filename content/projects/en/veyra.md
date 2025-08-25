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

# Veyra

Modern browser start page with modular architecture and customizable widgets.

## Project Description

Veyra is a browser extension that replaces the standard new tab with a personalized page containing a set of useful widgets. The project is created using modern web technologies and follows the principles of modular architecture, allowing users to customize the interface according to their needs.

## Key Features

- **Modular architecture** - widget system with enable/disable capability
- **Customizable backgrounds** - gradients, solid colors with animation
- **Multilingual** - internationalization support through Vue I18n
- **Responsive design** - correct display at different resolutions
- **Local storage** - settings saved in browser localStorage

## Technologies

- **Vue.js 3** - modern framework with Composition API
- **WXT** - tool for developing browser extensions
- **Pinia** - application state management
- **Vue I18n** - internationalization and localization
- **CSS Custom Properties** - dynamic styles and animations
- **Vue Draggable** - drag & drop functionality

## Architecture

The project is built on component architecture principles:

- **Entrypoints** - entry points for different parts of the extension
- **Components** - reusable Vue components
- **Store** - centralized state management through Pinia
- **Locales** - localization files for different languages

### Widget Structure:

- TimeDisplay - time and date display
- WeatherWidget - weather forecast through OpenWeather API
- LinksDisplay - quick links and bookmarks
- NotesWidget - notes and memos
- Background - customizable background with animation

## Functionality

### Interface Settings:

- Background type selection (solid/gradient)
- Color and gradient angle configuration
- Background animation with configurable speed
- Active widget management

### Widgets:

- **Time and date** - current time with real-time updates
- **Weather** - weather forecast for selected city
- **Quick links** - personalized bookmarks
- **Notes** - simple notepad for notes

### Personalization:

- Saving settings in localStorage
- Settings migration between versions
- Configuration data validation
- Support for Russian and English languages

## Results

- **Performance** - fast loading and interface response
- **Flexibility** - easy to add new widgets and features
- **User experience** - intuitively understandable settings
- **Cross-platform** - support for Chrome, Firefox and other browsers
- **Extensibility** - modular architecture for future improvements

## Technical Details

### Settings System:

- Reactive state through Vue 3 Composition API
- Automatic saving of changes
- Data validation and migration
- Support for complex configuration objects

### Animations:
