# Project Structure

This file describes the structure of projects in the portfolio.

## Project Fields

### Basic Fields

- `title` - project name
- `description` - brief description
- `date` - creation/update date (YYYY-MM-DD)
- `type` - project type (see below)
- `stage` - development stage (see below)
- `featured` - featured project (true/false)

### Project Types

- `web-app` - Web application
- `mobile-app` - Mobile application
- `website` - Website
- `library` - Library
- `tool` - Tool
- `game` - Game
- `design` - Design project 🆕

### Development Stages

- `planning` - Planning
- `in-progress` - In development
- `completed` - Completed
- `on-hold` - On hold
- `archived` - Archived

### Links

- `github` - link to GitHub repository
- `demo` - link to demo (null if none)
- `behance` - link to Behance (for design projects) 🆕
- `dribbble` - link to Dribbble (for design projects) 🆕

### Media

- `image` - path to preview image
- `logo` - path to project logo
- `background` - path to background image
- `gallery` - array of paths to gallery images

### Technologies

- `technologies` - array of strings with technology names (deprecated)
- `tags` - array of objects with tags (recommended)

### Project Colors 🆕

- `color` - main project color in hex format (#ff6b6b) or named color
- Used for filtering and visual representation of the project

## Tag Structure

```yaml
tags:
  - name: "Vue.js"
    color: "emerald"
    icon: "lucide:code"
  - name: "TypeScript"
    color: "blue"
    icon: "lucide:file-type"
  - name: "CSS"
    color: "pink"
    icon: "lucide:palette"
```

### Available Tag Colors

- `emerald` - Emerald
- `blue` - Blue
- `pink` - Pink
- `green` - Green
- `teal` - Teal
- `purple` - Purple
- `orange` - Orange
- `red` - Red
- `yellow` - Yellow
- `indigo` - Indigo
- `gray` - Gray
- `cyan` - Cyan
- `lime` - Lime

### Project Colors 🆕

Project color can be specified in any format:

- **Hex**: `#ff6b6b`, `#3b82f6`
- **Named**: `red`, `blue`, `green`
- **RGB/RGBA**: `rgb(255, 107, 107)`, `rgba(59, 130, 246, 0.8)`

## Tag Icons

Tags support icons in the format:
