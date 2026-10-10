# Variant Canvas Levels Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Apply the requested 950/900 dark and 50/100 light canvases while retaining visible panel separation and reporting the changed contrast.

**Architecture:** Select explicit neutral references in core modes/overrides. Raised surfaces become dark=900, dark-soft=800, light=white, light-soft=50; otherwise light canvas and raised would coincide. Keep syntax, strong/primary/secondary/subtle ink and accent coordinates; inverse text retains its canvas reference. Keep semantic mappings. Light selection mixes canvas/primary at .9; light-soft selection retains the raised/primary mix at .95, so both separate from their canvases and preserve primary-text contrast. Regenerate all consumers; lab defaults already resolve the actual canvas.

**Tech Stack:** OKLCH, TypeScript, pnpm, deterministic token and port generators.

## Task 1: Apply and measure

Set dark canvas=soft_950 (.14), dark-soft=soft_900 (.21), light=soft_50 (.96), light-soft=soft_100 (.90). Measure canvas/raised separation, mono hierarchy, chromatic tier direction, WCAG and APCA. Keep palette anchors and inks unchanged. Requested light-soft background reduces primary/secondary neutral contrast to 4.89/4.08:1 and colored base/muted contrast to 3.42–3.81/2.79–3.10:1. Record these explicit visual calibration bounds without claiming WCAG AA or visual acceptance.

## Task 2: Synchronize contracts and documentation

Update core surface fixtures and variant-specific contrast floors in `core/tests/tokens.test.ts`; retain strict foreground hierarchy, gamut/export and alias contracts. Update current tables/metrics in `core/README.md`. Regenerate tokens and native ports; verify all foreground/accent coordinates match the previous revision.

## Task 3: Deliver preview

Run token/port data checks and types, lint, app types and static generation. Push the existing preview branch and verify deployment. No browser/UI tests under current project instructions. User manually compares panel separation, dark strongest-ink glare, and light-soft type/comment/string readability at actual editing sizes. No editor-distribution release.
