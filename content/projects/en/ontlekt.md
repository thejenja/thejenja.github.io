---
title: "ONT.Lekt"
description: "Educational process management system with functions for managing subjects, groups, journals, schedules, and users"
color: "#EB7043"
background: "radial-gradient(111.8% 111.8% at 100% 0%, #EB7043 0%, #EA6839 100%)"
icon: "🎯"
technologies: ["Laravel", "Jetstream", "Inertia.js", "SQLite"]
date: 2025-09-30
slug: "ont-lekt"
type: "web-app"
stage: "completed"
---

# ONT.Lekt: Digital Foundation of an Educational Institution

The educational process is a complex mechanism consisting of thousands of moving parts: schedules change, workloads are redistributed, grades are given. **ONT.Lekt** is an attempt to tame this chaos. It is not just an electronic journal, but a complex ERP system for an educational institution that digitizes administrative routine, allowing teachers to focus on the main thing—teaching.

## Next Generation Monolith

When choosing the architecture, I rejected the trendy division into microservices in favor of reliability and development speed. The project is built on **Laravel 12**—a framework that sets standards in the PHP world.

**Inertia.js** is used as the link between the backend and interface. This is a game-changing technology: it allows writing a modern reactive frontend (on Vue.js) while staying in the comfortable ecosystem of Laravel routing and controllers. The result is an application that feels like a SPA (Single Page Application) with instant transitions without page reloads, but retains the simplicity of maintaining a classic monolith.

## Data Ecosystem

The heart of the project is a complex but logical database structure that models real processes in a college or university:

- **Academic Structure**: The system builds a hierarchy "Specialty → Group → Discipline". This allows flexible management of student streams.
- **Workload Management**: The `LoadController` module is implemented, solving one of the main pains of head teachers—distributing hours among teachers. The system ensures that not a single hour is lost or duplicated.
- **Journals and Schedule**: This is the operational memory of the institution. `JournalController` and `CalendarController` work in tandem, allowing not only tracking attendance and grades but also visualizing the educational process on a timeline.

## Security and Access

In a system where personal data of students and staff is stored, security cannot be optional. **Laravel Jetstream** is used for authentication. This is a powerful powerhouse that provides two-factor authentication, session management, and a secure user profile "out of the box."

Access rights differentiation is implemented at a deep level. The system clearly separates what a student can see, what a teacher can see, and what only an administrator has access to. Integration with **Laravel Sanctum** opens opportunities for future scaling: the API is ready for connecting a mobile application or third-party analytics services.

## Code Architecture

The project follows strict MVC (Model-View-Controller) principles. Logic is not smeared across files but clearly structured:

- **Controllers** are responsible for handling requests and business logic.
- **Resources (Inertia)** are responsible for data presentation on the client.
- **Middleware** stands guard over routes, checking access rights before the request reaches the controller.

This approach ensures high code `maintainability`. A new developer opening the project will immediately understand where to look for grade calculation logic and where to look for group list generation.

## Outcome

ONT.Lekt is an example of how modern web technologies transform the conservative sphere of education. The project replaces piles of paper and Excel spreadsheets with a single digital space. It is a tool that makes the educational process transparent, manageable, and modern.
