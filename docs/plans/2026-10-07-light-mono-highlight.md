# Light Mono Highlight Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Share soft_800 mono highlight between light and light-soft for a manual preview trial.

**Architecture:** Remove the light-soft text.strong override and inherit the light-mode neutral reference. Preserve the shared family/syntax/terminal alias graph, including strongest text, variables, cursor and ANSI 15. Retain backgrounds, base/muted grays, accent tiers and both dark variants.

**Tech Stack:** JSON OKLCH spec, TypeScript resolver and generators, pnpm.

## Task 1: Update the authored reference

Modify core/spec.json: bump version to 0.2.6 and remove the light-soft text.strong override. Update the existing mono selection fixture in core/tests/tokens.test.ts from soft_700 to soft_800. Update current mono tables, tier gaps and light-soft strongest-ink contrast in core/README.md.

## Task 2: Verify derived outputs

Regenerate tokens and ports. Run token/port check, data tests, types, lint, app typecheck and static generation. Compare resolved outputs against HEAD to confirm only light-soft strongest-ink aliases change, aside from version metadata. No browser or UI tests.

## Task 3: Publish the trial

Commit and push the existing preview branch. Verify Cloudflare deployment and HTTP availability; do not publish editor preview distributions. User manually compares variable/keyword separation, variable prominence relative to colored tokens, and cursor visibility.
