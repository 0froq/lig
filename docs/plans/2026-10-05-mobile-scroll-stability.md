# Mobile Scroll Stability Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Keep text, handwritten strokes and watercolour aligned while scrolling on mobile.

**Architecture:** Use document-anchored, overscanned canvas slices for both animated layers. Rebuild pen geometry only after actual content/layout changes; constrain grid content and horizontal document overflow.

**Tech Stack:** TypeScript, Canvas 2D, WebGL2, CSS, Nuxt.

## Task 1: Contain mobile content

Use shrinking grid tracks and items; retain local horizontal scrolling for code and palette rows. Use stable viewport heights for document spacing.

## Task 2: Synchronize decorative layers

Share document-anchored canvas sizing and slice origin logic between pen and washes. Avoid clearing unchanged canvas sizes. Preserve stroke progress during genuine layout rebuilds, and ignore toolbar-only height changes.

## Task 3: Verify and deliver

Run lint, typecheck and static generation; inspect diffs. Do not write UI tests or operate a browser. Manual checks: diagonal/fast scroll, toolbar expansion, portrait/landscape, section-circle alignment, code-row scrolling, theme switches and writing completion. Implement in this session under the user's request; no subagent handoff.
