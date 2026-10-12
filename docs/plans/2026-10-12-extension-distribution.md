# Extension distribution Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Package the existing LiG icon, support Cursor's Open VSX registry, and prepare the first Zed registry submission.

**Architecture:** The canonical compiler owns the icon and distribution workflows. Both VS Code stores receive the same verified release VSIX; Open VSX starts with a one-time access token and then uses OIDC. Zed registration pins the current official repository commit and leaves manual testing and upstream PR communication to the human maintainer.

**Tech Stack:** TypeScript, PNG, Python 3.11, GitHub Actions, vsce 3.6.2, ovsx 1.2.0, pnpm.

---

## Task 1: Include the canonical icon in VS Code packages

Files: `core/scripts/icons.ts`, `ports/compile.ts`, `ports/constants.ts`, `ports/contracts.test.ts`, `ports/distribution/release.py`, `ports/distribution/tests/test_release.py`.

1. Export the existing canonical PNG renderer; compile `vscode/icon.png` and set `package.json.icon` to `icon.png`.
2. Hash the renderer source as a compiler input. Advance the VS Code package to 0.2.2 and use a new immutable source ref.
3. Verify the declared icon's bytes inside VSIX, including missing/tampered-icon rejection. Preserve compatibility with older releases without an icon.
4. Run `pnpm tokens:check`, `pnpm ports:generate`, `pnpm ports:check`, `pnpm ports:typecheck`, `pnpm ports:test`, and `python3 -B -m unittest discover -s ports/distribution/tests`.
5. Package and validate the real 0.2.2 VSIX. No UI tests; human checks icon appearance on light/dark store and editor surfaces.

## Task 2: Publish the same release artifact to Open VSX

Files: `ports/distribution/vscode-release.yml`, `ports/distribution/vscode-publishing.md`, `ports/readme.ts`.

1. Add explicit `bootstrap-openvsx` and `publish-openvsx` manual modes to the existing workflow.
2. Add an `open-vsx` environment job consuming the same prepared artifact. Bootstrap reads only its environment token; ongoing publication requires OIDC and uses `ovsx@1.2.0 --skip-duplicate`.
3. Enable automatic publication only after repository variable `OPEN_VSX_ENABLED=true`; preserve Marketplace-only operation during account setup.
4. Document personal agreement acceptance, exact-case namespace `froQ`, first publication, namespace ownership, trusted-publisher registration for `release.yml`, token deletion and automatic enablement.
5. Check YAML and action expressions, packaging, and generated checksums; open canonical and generated-distribution PRs. Publication remains pending account setup and merge.

## Task 3: Prepare the Zed registry branch

Files in the personal fork `0froq/extensions`: `.gitmodules`, `extensions.toml`, `extensions/lig-theme`.

1. Pin public `0froq/zed-theme-LiG` main commit `7d2c4ca039069181c36e045f5c5fe1d2fca518f4`, version 0.1.2.
2. Add the HTTPS submodule and matching registry entry; run the upstream sorter and inspect the exact three-file diff.
3. Push the prepared branch, supply the compare link and local dev-extension path.
4. The user manually checks all four themes at this commit, writes their own PR body and submits it, as required by upstream prerequisites and AI policy. Do not claim this manual acceptance from artifact checks.
