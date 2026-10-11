# Paper Variants Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Ship selectable light-paper and dark-paper trials on the preview site for the user to compare real parsed code.

**Architecture:** Author a separate low-chroma paper ramp and two site-matched canvas anchors in core/spec.json. Add two variants that inherit the existing light/dark semantic accent logic and override surfaces, mono inks, inverse roles and borders. Keep the four existing variants unchanged. All outputs use the same resolver and port compiler; publish only the website preview, not editor distribution repositories.

**Tech Stack:** OKLCH JSON, TypeScript, Vue script setup, Nuxt, pnpm generators.

## Task 1: Core paper definitions

Extend core/types.ts and core/spec.json with a paper primitive group and two variant names. Light canvas matches #f4f2ec (L .961031 C .008251 H 91.4834); dark canvas matches #111113 (L .178529 C .004066 H 285.9807). Low-chroma warm ramp follows the existing L anchors; raised surfaces use .99/.24 and mono inks keep standard light/dark L positions. Extend core/resolve.ts palette export. Bump design version to .2.7.

## Task 2: Website selection and lab

Extend app/utils/lig-variant.ts and bilingual labels. Keep paper selections available in all selector studies, including keyboard navigation. Initialize independent lab states from VARIANTS. Preserve mono inks even though paper grays have nonzero chroma; expose paper backgrounds and show the paper ramp for paper variants. Source site canvases from the core definitions to avoid duplicate authoring.

## Task 3: Data and native contracts

Update existing numeric calibration fixtures for paper canvases, mono ramp choices and accent gamut expectations. Add data contracts proving the paper profiles retain standard accent coordinates and alias propagation, reproduce the site canvas anchors, and preserve low-chroma mono inks. No UI tests or browser checks. Extend native labels/readme for the two variants without releasing distribution repositories.

## Task 4: Delivery

Regenerate tokens and ports. Run data checks/tests and core/port/app types, lint and static generation. Compare the four existing resolved variants with HEAD to confirm they are unchanged. Commit/push the current preview branch; verify deployment and HTTP availability. User compares paper versus neutral light/dark, parameter/type/action separation, muted comments, panels and selection at actual editing sizes.
