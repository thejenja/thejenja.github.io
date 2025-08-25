---
title: "ONT.Prof"
description: "Career guidance and development platform with AI assistant"
color: "#3b82f6"
background: "radial-gradient(111.8% 111.8% at 100% 0%, #316cec 0%, #1558ea 100%)"
icon: "🎯"
slug: "ont-prof"
type: "web-app"
stage: "completed"
technologies: ["laravel", "vue", "inertia", "mysql", "gsap", "ai", "redis"]
date: 2025-06-24
gallery:
  [
    "/projects/ont-prof/main.png",
    "/projects/ont-prof/dashboard.png",
    "/projects/ont-prof/game.png",
    "/projects/ont-prof/tests.png",
  ]
---

# ONT.Prof

Modern career guidance platform combining testing, AI assistant and mentoring for professional development.

## Project Description

"ONT.Prof" is a comprehensive career guidance platform created to help people choose and develop their careers. The project combines modern web technologies, artificial intelligence and gamification, creating a unique experience for users of all ages.

The platform solves a key problem of our time - the complexity of choosing a professional path in a rapidly changing world. It offers not just tests, but an entire ecosystem for development: from primary diagnosis to gaining practical skills under the guidance of experienced mentors.

## Key Features

- **AI assistant** - intelligent chatbot for consultations
- **Testing system** - adaptive tests in various areas
- **Mentoring** - connection with experts in chosen field
- **Gamification** - achievement system, levels and progress
- **Personalization** - individual recommendations based on results
- **Mobile responsiveness** - works on all devices

## Technologies

### Backend

- **Laravel 12** - modern PHP framework
- **MySQL** - reliable relational database
- **Redis** - caching and queues
- **OpenRouter API** - integration with AI models

### Frontend

- **Vue 3** - progressive JavaScript framework
- **Inertia.js** - bridge between Laravel and Vue
- **GSAP** - advanced animations
- **Vite** - fast module bundler

### Additional Technologies

- **Laravel Breeze** - authentication and authorization
- **Laravel Sanctum** - API tokens
- **Pest** - modern testing
- **Sass** - CSS preprocessor

## Architecture

The project is built on monolithic architecture principles with clear layer separation:

### Application Structure

```
app/
├── Http/Controllers/     # Controllers for request processing
│   ├── Admin/           # Administrative panel
│   ├── App/             # User area
│   └── Landing/         # Landing and public pages
├── Models/              # Eloquent models for database work
├── Services/            # Business logic and external APIs
├── Notifications/       # Notification system
└── Policies/            # Access and authorization policies
```

### Database

- **Normalized structure** with foreign keys
- **Migrations** for schema versioning
- **Seeders** for test data
- **Factories** for generating test data

### API and Integrations

- **RESTful API** for external integrations
- **OpenRouter API** for AI functions
- **Email notifications** via SMTP
- **Queues** for asynchronous tasks

## Functionality

### For Users

- **Profile and progress** - development tracking
- **Testing** - taking tests in various areas
- **AI chat** - consultations with artificial intelligence
- **Mentors** - finding and connecting with experts
- **Achievements** - gamification and motivation system
- **Reviews** - service quality assessment
