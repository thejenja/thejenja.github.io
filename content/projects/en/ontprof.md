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

# ONT.Prof: Career Navigator of the Future

Choosing a profession is one of the most difficult decisions in life. The project **"ONT.Prof"** aims to turn this stressful process into an exciting and conscious journey. It is a large-scale educational platform that combines classic career guidance methods with advanced artificial intelligence technologies and gamification. We created an ecosystem where the user doesn't just take tests but builds their development trajectory with the support of AI and real mentors.

## Intelligence and Technologies

The core of the system became **Laravel 12** in conjunction with **Vue 3** and **Inertia.js**. This "gold standard" of modern development allowed building a reliable monolithic application. But the real magic happens in the integration with AI.

We used the **OpenRouter API** to create a smart assistant. Unlike ordinary chatbots, our AI analyzes context: results of tests passed by the user, their interests, and previous answers. This allows giving personalized recommendations that are truly relevant to a specific person, rather than being a set of generic phrases.

To ensure performance under high loads (for example, during mass testing), **Redis** is used. It takes on caching and task queue management, guaranteeing that the interface remains responsive even when the server processes complex requests to neural networks.

## Gamification and UX

Learning and self-analysis can be boring. To hold user attention, we implemented a powerful gamification system. Progress is visualized through a system of levels and achievements. For completing stages, users receive rewards, which stimulates them to move further.

The visual part of the interface is enlivened using **GSAP** (GreenSock Animation Platform). Smooth transitions, point scoring animation, interactive charts—all this makes working with the platform emotionally pleasant. We moved away from a dry academic style to a modern, bright design that speaks the same language as the young audience.

## Mentorship Ecosystem

Technologies are good, but human experience is irreplaceable. The platform includes functionality for mentors. Experts can create profiles, manage session schedules, and communicate with students. A complex role model and administrative panel for content moderation and methodology effectiveness analysis are implemented.

## Outcome

"ONT.Prof" is a project with a social mission, packaged in a modern technological shell. It demonstrates how complex backend processes, artificial intelligence, and thoughtful UX can work together, helping people find their calling. It is a platform that grows with the user, adapting to their needs and goals.
