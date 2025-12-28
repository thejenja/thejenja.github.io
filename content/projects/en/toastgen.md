---
title: "ToastGen"
description: "Generator of system notifications in Python"
color: "#eab308"
icon: "🍞"
slug: "toastgen"
type: "desktop-app"
stage: "archived"
technologies: ["python", "ttkbootstrap", "tkinter", "windows-api"]
date: 2022-09-12
linksTop:
  [
    {
      "label": "GitHub",
      "href": "https://github.com/thejenja/toastgen",
      "icon": "github",
    },
  ]
---

# ToastGen: First Steps in GUI

Every developer has their own "Hello World" that got out of control. For me, such a project was **ToastGen**. It's not just a program; it's a monument to my path of learning Python and creating graphical interfaces.

## Idea and Implementation

In 2022, standard `tkinter` seemed boring and gray (literally) to me. I was looking for ways to make Python applications beautiful and stumbled upon the **ttkbootstrap** library. It allowed "pulling" modern Bootstrap themes onto good old `tk`.

ToastGen was born from a simple question: _"How do programs show these beautiful notifications in the corner of the Windows screen?"_. Instead of Googling the answer, I decided to write a utility that does this.

The program allows the user to:

1. Enter the title and text of the notification.
2. Select the design style (Success, Warning, Danger).
3. Press a button and see a native Windows notification (Toast).

## Technical Details

Under the hood, the `win10toast` library (or its analogs in conjunction with system API) is used to call notifications and `ttkbootstrap` for rendering the generator window itself.

The project code is simple and naive, as befits a study project. But it was here that I first encountered the concepts of **Event Loop**, **Callback functions**, and **Layout Management** (the famous `.pack()` and `.grid()`). It was a testing ground where I learned to connect backend logic (Python script) with frontend (application window).

## Project Significance

Today, ToastGen may seem primitive, but for me, it is important as a starting point. It is the moment of transition from "solving puzzles in the console" to creating something you can touch with a mouse. It is a reminder that even the most complex path begins with a simple pop-up notification: _"Hello, Developer!"_.
