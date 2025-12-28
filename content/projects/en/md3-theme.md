---
title: "MD3 Theme"
description: "Material Design 3 theme for OpenVK"
color: "#6750a4"
icon: "🎨"
slug: "md3-theme"
type: "userstyle"
stage: "completed"
technologies: ["css", "css-variables", "material-design"]
date: 2023-06-20
linksTop:
  [
    {
      "label": "GitHub",
      "href": "https://github.com/thejenja/md3theme",
      "icon": "github",
    },
  ]
---

# MD3 Theme: Google Aesthetics on OpenVK

**OpenVK** is a project dedicated to recreating the old interface of VKontakte. But what if we cross a nostalgic engine with the most modern design language from Google? That’s how **MD3 Theme** was born—an attempt to introduce the Material You (Material Design 3) philosophy where it seemingly didn't belong.

## Design Concept

Material Design 3 is about large corner radii, dynamic colors, pastel tones, and the absence of shadows in favor of tonal elevation. Transferring this to the rigid grid of OpenVK was a challenge.

In this project, I:

- Completely rewrote the site's color palette using CSS variables (`--md-sys-color-primary`, `--md-sys-color-surface`, etc.).
- Changed button shapes from the usual rectangles to "pill-shapes."
- Implemented the characteristic **Roboto** and **Google Sans** fonts.
- Reworked the navigation, making it look like modern Android applications.

## The Power of UserCSS

Technically, this is **UserCSS**—a user style applied over the original site using the Stylus extension. This required a deep understanding of CSS Specificity. I had to use `!important` wisely and find the most specific selectors to override the engine's default styles.

## The Result

MD3 Theme turns OpenVK into something completely different. It is no longer a clone of VK circa 2010, but a modern social network that could exist if Pavel Durov worked at Google. The project demonstrates the power of CSS: without changing a single line of HTML or JS on the server, we completely change the user's perception of the product.
