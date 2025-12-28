---
title: "ITD Social SDK"
description: "Unofficial SDK for the ITD social network"
color: "#fff"
icon: "📦"
featured: true
slug: "itd-sdk"
type: "library"
stage: "completed"
technologies: ["typescript", "npm", "api", "ai"]
date: 2025-12-21
linksTop:
  [
    {
      "label": "GitHub",
      "href": "https://github.com/thejenja/itd-social-sdk",
      "icon": "github",
    },
  ]
---

# ITD Social SDK: One Night Magic

Sometimes the best tools are born not in long meetings, but in a rush of pure enthusiasm. **ITD Social SDK** is a story about how you can create a full-fledged library for interacting with a new social platform in just one evening.

## Context of Creation

When blogger Ilya Novki (nowkie) launched his social network **ITD**, the developer community instantly livened up. But the API was "raw," documentation was missing, and the desire to automate processes was huge. I accepted this challenge. Armed with TypeScript and the support of advanced AI models, we (me and the neural network) held a hackathon lasting one night.

The result was `itd-social-sdk`—a tool that turns the chaos of unstructured requests into elegant, strictly typed code.

## Technical Solution

The project is written in **TypeScript**, which was a fundamental decision. When working with undocumented APIs, typing saves hours of debugging. The library structure is modular:

- **Auth Module**: Simplified work with tokens (Bearer auth).
- **User Service**: Retrieving profile, updating bio, avatars.
- **Feed Service**: Smart feed with pagination and filtering.
- **Interaction Service**: Likes, comments, and social graph.

A special source of pride is the "hacky" way of obtaining a token described in the README. Since official OAuth didn't exist yet, I proposed a simple way for developers to extract credentials directly from browser DevTools, which lowered the entry barrier for creating bots.

## "Unofficial" Philosophy

This is an experimental project. It lacks complex Enterprise-level architecture, but it has soul and speed. It proves that modern web development allows creating working solutions for integration with any services literally on the fly. The library became a kind of bridge between the social network's closed API and the community of enthusiasts wishing to write their own bots and alternative clients.

In a world where code is often written for months, ITD SDK reminds us of the old school spirit: saw a problem — wrote code — released to NPM. Fast, bold, and typed.
