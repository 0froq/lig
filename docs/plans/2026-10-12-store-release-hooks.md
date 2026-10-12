# Store release hooks implementation plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Synchronize stable editor repository releases with the existing VS Code Marketplace entry and Zed's reviewed extension registry.

**Architecture:** Keep workflows and validation in the canonical port compiler so distribution imports retain them. A published stable GitHub release triggers its store workflow; manual dry runs and retries target the same release tag. VS Code publishes the checksum/identity-verified release VSIX using GitHub OIDC only. Zed prepares first-registration material and, once registered, opens version-update PRs with the community action linked by Zed's official documentation.

**Tech Stack:** GitHub Actions, Python 3.11+, GitHub CLI, pinned vsce, Azure Login, Zed extension registry.

---

## Task 1: Release validation

- Create `ports/distribution/release.py` and `ports/distribution/tests/test_release.py`.
- Check stable tag/version/identity, reject draft/prerelease publishing, validate existing VSIX content and digest, and never overwrite release assets.
- Check Zed registry versions, repository identity and exact registered commit; prepare first-registration artifacts without claiming manual acceptance.
- Run `python3 -m unittest discover -s ports/distribution/tests -v` with rejection cases as well as valid packages.

## Task 2: Store hooks

- Create `ports/distribution/vscode-release.yml` and `ports/distribution/zed-release.yml`.
- Modify `ports/distribution.ts`, `ports/compile.ts` and `ports/zed/distribution.ts` to ship workflows, helper and publishing docs.
- VS Code keeps `froQ.theme-lig`; prepare and publish are separate jobs, with OIDC permission only on publishing.
- Zed uses the theme-specific `lig-theme` identity for its first store submission; skip current versions and refuse implicit first submission.
- Add release validation to `.github/workflows/ports.yml`; run actionlint on source and emitted workflows.

## Task 3: Documentation and distribution

- Add `ports/distribution/PUBLISHING.md` and link it from generated editor READMEs.
- Bump VS Code to `0.2.1`, Zed to `0.1.2`, compiler to `0.7.0`; pin a new immutable source tag.
- Generate/check artifacts, check unchanged native theme values, import verified payloads into the two clean official repositories and create focused PRs.
- Keep old releases immutable. Do not expose or infer credentials; document missing one-time setup.

## Task 4: Verification and handoff

- Run Python release checks, port type/contracts/artifact checks, emitted distribution verification and workflow lint.
- Inspect remote CI on each PR. Exercise a VS Code workflow dry run against the existing stable release; no store mutation.
- List exact one-time account setup and Zed's manual first-submission requirement. Do not claim either store has published before remote confirmation.

## Official references

- https://code.visualstudio.com/api/working-with-extensions/publishing-extension
- https://zed.dev/docs/extensions/publishing/prerequisites
- https://zed.dev/docs/extensions/publishing/publishing-guide
- https://zed.dev/docs/extensions/publishing/updating-and-maintenance
- https://github.com/zed-industries/extensions/blob/main/AI_POLICY.md
