# Supported Paper Variants Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the two soft variants with paper as the supported alternative to standard light/dark.

**Architecture:** Keep exactly light, dark, light-paper and dark-paper in the authored spec, types, website and native compiler. Preserve every remaining resolved color. Migrate legacy website query/storage soft names to the corresponding paper names at the input boundary, without keeping soft output identities. Prune only obsolete files owned by the previous generated manifest so native builds cannot retain dangling soft entrypoints.

**Tech Stack:** JSON/OKLCH, TypeScript, Vue script setup, pnpm, native Neovim Lua.

## Task 1: Remove soft definitions

Bump core/spec.json to 0.2.8; remove light-soft/dark-soft overrides and variant union members. Remove obsolete calibration fixtures and soft-only data contracts; retain all shared contracts and paper accent/alias checks.

## Task 2: Consolidate selectors and migration

Keep crisp/paper treatments in app/utils/lig-variant.ts, Matrix, Sentence and CSS. Remove soft labels and trial wording from bilingual copy. Normalize old query/storage soft selections to paper in useLigVariant. Preserve independent lab settings for the four supported variants.

## Task 3: Native artifacts and docs

Remove soft labels and verification cases from native port sources; replace them with paper. Add manifest-owned stale artifact pruning to the compiler with data tests for deletion, check-only behavior, unmanaged file retention and traversal rejection. Update current core/port docs and README generation to the supported four-variant model; preserve historical plans.

## Task 4: Verify and publish preview

Regenerate tokens and ports. Verify retained resolved variants exactly match HEAD; confirm no soft files remain in output manifests/directories. Run data tests, core/port/app types, lint, native headless contracts and static generation. No UI tests or browser checking. Push the existing preview branch and verify deployment/HTTP availability. Manual checks: four selectors, old soft bookmark/storage migration, paper lab controls and mobile wrapping. No editor distribution release.
