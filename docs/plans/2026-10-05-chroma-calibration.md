# Chroma Calibration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Reduce grayness in dark accents and increase colorfulness in light accents.

**Architecture:** Change only canonical accent chroma and mode offsets. Keep hue, lightness, gray ramp, canvas selections and tier logic; regenerate all consumers from the same source.

**Tech Stack:** OKLCH spec, TypeScript, pnpm, deterministic token and port generators.

## Task 1: Calibrate

Use dark/dark-soft C=.120 and light/light-soft C=.110. Preserve each variant's current L. Review sRGB reductions and contrast numerically; no browser or UI tests.

## Task 2: Synchronize

Update calibration contracts and documentation, regenerate token artifacts and native port outputs. Do not publish new editor-distribution releases in this site-preview iteration.

## Task 3: Deliver

Run token/port checks, lint, typecheck and static generation. Push the existing preview branch and verify deployment status. User compares default colors, both tier directions, variant switches and parsed-code demos manually.
