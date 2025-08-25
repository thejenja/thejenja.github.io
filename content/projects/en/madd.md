---
title: "madd label"
description: "landing page and CRM development"
color: "#ff0f3e"
icon: "I"
featured: true
slug: "madd"
type: "web-app"
stage: "completed"
technologies: ["laravel", "vue", "inertia", "vite", "mysql", "postgresql"]
demo: "https://maddlink.ru"
date: 2025-06-30
gallery: ["/projects/madd/dashboard.png"]
---

# MADD Label

Modern web platform for managing music releases, artists and analytics in the music industry.

## Project Description

MADD Label is a comprehensive platform developed for music labels and artists that provides tools for managing music releases, tracks, artists and analytics. The project demonstrates a modern approach to web application development using Laravel and Vue.js, creating a seamless user experience.

## Key Features

- **Release management** - complete cycle of creating and publishing music albums
- **Artist system** - artist profiles with detailed information
- **MADD Links** - unique link system for content distribution
- **Analytics** - detailed statistics on releases and tracks
- **Audio streaming** - Range requests support for efficient loading
- **OAuth integration** - authorization through social networks
- **Real-time notifications** - instant alerts about events

## Technologies

### Backend

- **Laravel 12** - modern PHP framework
- **MySQL/PostgreSQL** - relational database
- **Laravel Sanctum** - API authentication
- **Laravel Jetstream** - ready-made authentication components
- **Laravel Socialite** - OAuth integration
- **Laravel Echo + Pusher** - real-time functionality

### Frontend

- **Vue.js 3** - progressive JavaScript framework
- **Inertia.js** - bridge between Laravel and Vue
- **Tailwind CSS** - utility-first CSS framework
- **Vite** - modern module bundler
- **Pinia** - state management for Vue
- **Chart.js** - interactive charts and diagrams

### Additional Tools

- **SASS** - extended CSS
- **Axios** - HTTP client
- **Laravel Pail** - CLI tools
- **Pest** - modern testing

## Architecture

The project is built on the principle of separation of responsibilities using modern patterns:

### Backend Architecture

- **MVC pattern** - clear separation of logic, presentation and data
- **Eloquent ORM** - powerful database management system
- **Resource Controllers** - RESTful API for all entities
- **Middleware** - access control and validation
- **Events & Listeners** - asynchronous event processing
- **Jobs & Queues** - background tasks and queues

### Frontend Architecture

- **Component-based** - reusable Vue components
- **Composables** - logic extracted into separate functions
- **Stores (Pinia)** - centralized state management
- **Layouts** - page templates
- **Middleware** - client-side validation and navigation

### Database

- **Normalized structure** - optimal data organization
- **Table relationships** - artist → release → track → madd_link
- **JSON fields** - flexible metadata storage
- **Migrations** - database schema versioning

## Functionality

### Artist Management

- Creating and editing artist profiles
- Uploading avatars and biographies
- Managing social networks
- Application system for new artists

### Release Management

- Creating music albums and singles
