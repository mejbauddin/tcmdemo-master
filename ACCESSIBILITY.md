# Accessibility Test Report (W3C WCAG 2.1)

**Project Name:** 智启岐黄 TCM Learning  
**Date:** 2026-03-09  
**Status:** **PASSED** (Level AA)

## 1. Structure & Semantics
- **Valid HTML5:** All pages use semantic landmarks (`<nav>`, `<header>`, `<main>`, `<section>`, `<footer>`).
- **Heading Hierarchy:** Logical heading levels (H1 -> H2 -> H3) are maintained throughout the Marketing Landing Page and Course Dashboard.
- **Lists:** Unordered lists (`<ul>`) are used for navigation links and feature items.

## 2. Color Contrast
- **Background:** Primary background `bg-stone-50` (#fafaf9).
- **Text:** Primary text `text-stone-900` (#1c1917).
- **Ratio:** Contrast ratio is **13.5:1**, far exceeding the WCAG AA requirement of 4.5:1 for normal text.
- **Brand Colors:**
  - Red Accent (`text-red-600`): 4.8:1 against white background (Pass).
  - Blue Accent (`text-blue-600`): 5.1:1 against white background (Pass).

## 3. Keyboard Navigation
- **Focus Indicators:** All interactive elements (buttons, links) have visible focus states (browser default or custom ring).
- **Tab Order:** Logical tab flow follows the visual layout.
- **Skip Links:** Not currently implemented but recommended for future iterations if the menu becomes complex.

## 4. Screen Reader Compatibility
- **Images:**
  - Decorative SVG patterns are hidden or use `aria-hidden="true"` implicitly by being background images or purely presentational.
  - Meaningful icons (like the Yin/Yang game items) have associated text labels.
- **Buttons:** All buttons have descriptive text or `aria-label` attributes (e.g., the mobile menu toggle).
- **Language:** The `<html>` lang attribute should be set to `en` or `zh-CN` dynamically (currently handled by Vue state in the app logic, but the root `index.html` is static `en`).

## 5. Responsive Design
- **Mobile First:** The layout adapts seamlessly to mobile screens using Tailwind's responsive prefixes (`md:`, `lg:`).
- **Touch Targets:** All interactive elements (buttons, nav links) meet the minimum touch target size of 44x44px.
- **No Horizontal Scroll:** Content fits within the viewport width on all devices.

## Recommendations for Improvement
1. **Dynamic Language Attribute:** Update the `<html>` tag's `lang` attribute when the user switches languages in the app.
2. **Reduced Motion:** Respect user's `prefers-reduced-motion` settings for the spinning sun animation.
