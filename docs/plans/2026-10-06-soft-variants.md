# Soft Variants Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make soft variants gentler at luminance extremes while preserving color identity, neutral hierarchy and shared port semantics.

**Architecture:** Keep primitives, standard variants and semantic mappings intact. Calibrate explicit soft overrides in `core/spec.json`, then regenerate website/native artifacts. Soft means lower surface/strong-ink contrast, not uniformly lower chroma or darker light-mode accents.

**Tech Stack:** OKLCH, TypeScript, pnpm, existing deterministic token and port compilers.

## Task 1: Calibrate soft roles

Light-soft: canvas `soft_100` (.94), raised `soft_50` (.98), mono highlight/base/muted `soft_700 / soft_600 / soft_500` (.38/.48/.58). Keep base accents .55/.11 and use ±.05 L tiers, retaining C/H. Dark-soft: canvas `soft_800` (.30), raised midpoint of `soft_800` and `soft_700` (.34), mono highlight/base/muted `soft_200 / soft_300 / soft_500` (.88/.78/.58), border/dim `soft_700`. Keep base accents .74/.12 and use ±.06 L with −.02 C tiers. Light-soft raised surfaces are lighter than their canvas; no universal mode-based surface-direction assumption.

## Task 2: Verify and document

Update `core/tests/tokens.test.ts` calibration fixtures and add soft invariants: distinct surfaces, reduced extreme contrast, unchanged base color identity, and propagated semantic/terminal aliases. Primary/secondary neutral text stays ≥4.5:1. Light-soft base accents deliberately use ≥3.8:1 and APCA magnitude ≥59.5 (displayed rounded value ≥60) instead of forcing darker ink; faded tiers use ≥3:1 and APCA magnitude ≥50. Record the narrower gradients and resulting limits in `core/README.md`.

## Task 3: Deliver preview

Run `pnpm tokens:generate`, `pnpm ports:generate`, generated-artifact checks, token/port data tests and types, lint, app types and static generation. Commit/push the existing preview branch and verify Cloudflare deployment status. No UI tests or browser checks; the user compares soft/standard switches, neutral keyword/variable/comment hierarchy, parsed-code colors and raised panels manually. Editor distribution repositories remain at their published preview until separately requested.
