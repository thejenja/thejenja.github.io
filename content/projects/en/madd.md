---
title: "madd label"
description: "Development of landing page and CRM"
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

# MADD Label: Digital Ecosystem of Music Business

The music industry is a chaos of releases, rights, statistics, and endless files. **MADD Label** was created to organize this chaos. It is not just a website, but a powerful corporate-level CRM platform developed specifically for music labels and artists. The project covers the full life cycle of a musical work: from demo upload to streaming analytics and royalty distribution.

## Monolithic Power: Laravel and Vue

To implement such a large-scale system, a proven and reliable stack was chosen. The backend is based on **Laravel 12**—a framework that is the de facto standard for complex web applications. This provided the project with a strict MVC structure, a powerful Eloquent ORM for working with complex data relationships (Artist → Album → Track → Link), and a high level of security.

The frontend part is implemented on **Vue.js 3** in conjunction with **Inertia.js**. This technology allowed creating the feel of a Single Page Application (SPA) without the need to build a separate API, while keeping all the benefits of classic server-side rendering. The user gets instant page transitions and a reactive interface, and the developer gets the convenience of maintaining a single monolith.

## Functional Core

The platform solves several key tasks:

1.  **Release Management**: Artists and managers can upload tracks and high-quality covers, input metadata, and schedule release dates.
2.  **MADD Links**: A proprietary smart-link system (analogous to Linktree, but tailored for music). A beautiful promo page with links to all streaming platforms is automatically generated for each release.
3.  **Audio Streaming**: _Range requests_ support is implemented, allowing tracks to be listened to directly in the browser with seeking capability, without downloading the entire file.
4.  **Analytics**: Interactive dashboards based on **Chart.js** visualize data on streams, clicks, and audience geography.

## Security and Real-time

In a system storing intellectual property, security comes first. A Role-Based Access Control (RBAC) model is implemented, distinguishing rights of administrators, managers, and artists. Authentication is strengthened via **Laravel Sanctum** and OAuth integration (Socialite), allowing login via social networks.

To provide instant feedback, Real-time technologies are introduced. The combination of **Laravel Echo + Pusher** allows sending notifications to users without reloading the page—whether it's a message about successful track moderation or new release statistics.

## Outcome

MADD Label is an example of how a complex domain can be packaged into a clear and user-friendly interface. The project demonstrates the maturity of architectural decisions: from a normalized database to a component-based frontend. It is a tool that turns creativity into business, taking on all the routine and allowing musicians to focus on the main thing—music.
