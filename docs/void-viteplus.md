# Void and Vite+

## Migration status

The pre-migration workspace is archived on `origin/main` at `1dcb041`.

- Nuxt uses Vite+ 1.3.0's Vite core through the workspace override. Its bundled Vite is 8.3.4, matching the previous Vite version.
- Vite+'s task runner runs existing scripts. Nuxt still owns rendering and static generation.
- Local `deploy` uses Void 1.1.12. Its configuration selects a static `dist` deployment, not Nuxt's SSR adapter. The user verified a real deployment before this final consolidation. Automatic production deployment still uses the old cf command until the Workers Builds credential check and cutover are complete.
- `void.config.ts` is the canonical deployment configuration. The cf configuration derives only the settings needed by native branch previews.
- Vite+ now runs all 48 existing non-UI tests through its bundled Vitest and provides the source correctness linter.
- The application now uses Oxlint for correctness and supported Vue rules, and Oxfmt for formatting. The ESLint config, direct dependencies and Nuxt module are removed. TypeScript, Python distribution checks and the existing hook mechanism remain in place.

The full `vp migrate` setup was deliberately not applied. It also changes linting, hooks, editor and agent configuration. This migration instead applies the documented aligned core override and pinned tool versions while retaining those project contracts. The vendored UI is not a workspace package and is not migrated.

## Runtime

Use Node 24.21.0. The supported range shared by Void and Vite+ is `^24.21.0 || >=26.0.0`. `.node-version` pins the GitHub workflows and `mise.toml` pins the local runtime. Keep them aligned.

With mise:

```sh
mise exec node@24.21.0 -- pnpm install --frozen-lockfile
mise exec node@24.21.0 -- pnpm exec vp run dev
```

Workers Builds production and preview `NODE_VERSION` are set to `24.21.0`. This was updated through cf and verified by reading the remote configuration back, including a request to patch existing previews. Both automatic builds and previews remain enabled.

The exact-version `minimumReleaseAgeExclude` entries were added by pnpm for Void's newly published packages. The existing `trustPolicy: no-downgrade` and cssnano override are retained.

## Commands

```sh
pnpm exec vp run dev
pnpm exec vp run typecheck
pnpm exec vp run lint
pnpm exec vp run fmt:check
pnpm exec vp run fmt
pnpm exec vp run check:core
pnpm exec vp run ports:generate
pnpm exec vp run test
pnpm exec vp run generate
```

Use `vp run`, not the built-in `vp dev`, `vp build` or `vp check`. The built-in commands do not run this project's Nuxt scripts or its combined checks. Tests use `tooling/vite.config.ts`. Oxlint and Oxfmt use native root `.oxlintrc.json` and `.oxfmtrc.json` configurations, passed explicitly in the scripts so ignore patterns are rooted correctly and Vite+ does not fall back to defaults. Nuxt continues to own the application's Vite configuration.

The test transformer explicitly uses `core/tsconfig.json`. Core and port CI can therefore install with `--ignore-scripts` and run without `.nuxt`; they do not inherit the root application's generated TypeScript references. This was verified in an archived checkout with no `.nuxt` directory.

`test` generates port artifacts, then runs the token, syntax and port suites once. The ports aggregator imports its lightweight and Zed suites, which are deliberately not discovered a second time. Generate ports before running the standalone `ports:test` command. Native syntax tests and `syntax:check` need the exact Neovim and parser revisions from `syntax/manifest.json`; see `syntax/README.md`. GitHub Actions type-checks the application and syntax sources, while native parsing checks use the pinned local installation.

`lint` runs Oxlint with its native TypeScript, Unicorn, Oxc and Vue plugins. `fmt` and `fmt:check` use Oxfmt. Formatting now follows Oxfmt instead of the previous Antfu style. The initial maintained-source baseline is formatted accordingly, with single quotes, no semicolons and one Vue attribute per line.

Rule coverage changes with this migration. ESLint-only Nuxt rules, Vue template rules not implemented by Oxlint, package catalog lint enforcement and Antfu style checks are no longer run. Keep `nuxt typecheck`, native Oxlint Vue checks, tests and build verification. Do not reintroduce ESLint to emulate the old style.

Vendored UI, MDC content, public/generated artifacts, fixtures, historical plans, agent instructions and generated locks are excluded from Oxfmt. They must not be rewritten by application-wide formatting. The vendored library still contains its upstream ESLint metadata, which this migration does not modify.

Vue templates use strict whitespace handling. Three local `prettier-ignore` comments preserve two whitespace-sensitive SVG plots and one multi-statement inline event handler. Oxfmt officially supports these comments for Vue templates. Without them, the installed formatter adds spaces to SVG labels and removes a statement separator required by Vue's event parser. All other maintained source follows Oxfmt. Source review verified equivalent TypeScript ASTs and compiled production template ASTs before and after formatting.

VS Code recommends `oxc.oxc-vscode` and selects it as the formatter. The root native configs are also usable by that extension without creating a root Vite config.

The application no longer has an ESLint executable or direct lint dependency. Some third-party packages still have transitive ESLint peer dependencies (the Nuxt builder's checker and Vue i18n tooling). Their presence in the lockfile does not enable an ESLint check in this project.

`vp staged` currently reads staged configuration from a root Vite config and exposes no explicit config option. Retain `lint-staged` and the existing hook instead of adding a root Vite config that Nuxt ignores. Staged checks now invoke Oxlint and Oxfmt with explicit native configuration paths, and honor the same excluded directories.

`build` and `generate` explicitly run `ports:generate` before Nuxt. They no longer depend on package-manager lifecycle hooks, which are not a portable assumption when using another task runner.

Task caching remains disabled. In particular, generation and deployment must not replay cached output without restoring the generated assets.

## Deployment

The production command is:

```sh
pnpm deploy
```

Void executes `inference.build`, which runs the existing generation task exactly once. Do not prepend another `pnpm generate`. For an explicitly prebuilt artifact, `pnpm exec void deploy --platform cloudflare --dir dist` skips building.

Native branch previews remain:

```sh
pnpm preview:deploy
```

Workers Builds runs `pnpm generate` and then `pnpm exec cf previews deploy`. Keep `cloudflare.config.ts`, `wrangler.config.ts`, and the direct cf/Wrangler dependencies for that supported preview path. The adapter intentionally has no production custom-domain triggers. Preview updates keep the branch URL stable and never publish the production domain.

Void has no native equivalent of this direct-Cloudflare branch-preview lifecycle, and `void project delete` refuses direct Cloudflare teardown. Do not replace previews with ad hoc per-PR Workers and custom cleanup scripts. `preview_urls: true` enables Worker version URLs; it does not implement Git branch previews.

Keep the deployed `lig.froq.me` custom-domain route, workers.dev and version-preview visibility explicit in `void.config.ts`. The custom-domain route must not include `zone_name`: the installed cf conversion layer rejects those extra custom-domain options. This is standard supported config, not a patched dependency.

### Workers Builds production cutover

Keep the existing Cloudflare GitHub connection for both production and branch previews. GitHub Actions only runs source, formatting, test and type checks. There is no GitHub deployment workflow, deployment secret or feature flag to enable.

Cloudflare manages the Workers Builds API token. Before switching production, verify that Void recognizes this credential in a fresh build runner. A temporary `pnpm exec void cloudflare status` prefix on this PR's preview trigger performs a read-only authentication check. It reports identity and credential source, never the token value. Restore the normal preview command after the check. Authentication success alone does not prove every deploy permission; the first production deployment must also verify readiness, version and domain operations.

| Setting        | Production target                                        | Branch previews                |
| -------------- | -------------------------------------------------------- | ------------------------------ |
| Node           | `24.21.0`                                                | `24.21.0`                      |
| Build command  | `pnpm generate`                                          | `pnpm generate`                |
| Deploy command | `pnpm exec void deploy --platform cloudflare --dir dist` | `pnpm exec cf previews deploy` |

The automatic production command remains `pnpm exec cf deploy` before cutover. The production target uses `--dir dist` because Workers Builds has already generated the site. Do not use `pnpm deploy` in that split build/deploy flow; that command asks Void to build again.

1. Completed: Workers Builds production and preview `NODE_VERSION=24.21.0`, including a patch request for existing previews. Keep both automatic builds and previews enabled.
2. Verify Void authentication with the managed build credential on the migration PR, without publishing production or exporting credentials. If it fails, inspect the managed token's permissions in Cloudflare instead of copying a local OAuth credential into CI.
3. Confirm the PR's branch preview serves the homepage, localized/nested pages and downloads, and returns 404 for a missing path.
4. Obtain explicit approval to merge the migration PR to `main`. Passing checks alone does not authorize landing.
5. Let any existing production build finish, then change only its deploy command to the target above. Keep its build command, repository connection, production trigger and branch-preview settings.
6. Add the non-secret production build variable `CLOUDFLARE_WORKERS_SUBDOMAIN=sayhola` for Void's readiness URL, then run one production build on the merged commit. Verify the domain, localized/nested URLs, assets, cache headers and 404 status, and check that PR previews still work.
7. If deployment fails, restore only the old production deploy command. Do not create a second production publisher or disconnect branch previews.

The resolved Cloudflare account ID is committed in `void.lock.json`. For another account, reconnect deliberately and update the target and workers.dev subdomain rather than relying on a local login cache. The managed token still needs the permissions listed in [Void's Cloudflare CI guide](https://void.cloud/integrations/cloudflare#deploying-from-ci).

Review and commit `void.lock.json` after real deployments change it. Ignore `.void/` and `.void-wrangler.jsonc`; they are generated. `void prepare` only generates local artifacts and is not a deployment dry-run. Void currently has no deploy dry-run flag.

## Checks

Validated with Node 24.21.0:

- Vite+ core and syntax checks: 21 token tests and 5 syntax tests, both TypeScript projects and generated-file checks. Tests now register through `vite-plus/test` without changing their assertions.
- Port checks: 22 contract tests, port TypeScript project and 121 generated artifacts.
- Python distribution tests: 12 tests.
- VS Code and Zed generated-package checksum verification.
- Nuxt type checking and static generation: 80 prerendered routes.
- `void prepare`, Void's configuration conversion, deployed-lock equivalence and the preview adapter's `cf build` without publishing.
- Frozen-lockfile installation, Oxlint, Oxfmt, actionlint and `git diff --check`.

Static generation reports a PostCSS warning for the homepage's nested `calc`/`clamp` font-size expression. It is outside this tooling migration. OG image compatibility warnings also appear during type preparation.

No browser UI tests are used. PR #20 has passed GitHub checks and native preview deployment. HTTP checks verified its homepage, localized/nested pages, downloads and missing-page status. Managed-credential verification and the automatic production cutover remain separate steps. Manually check page navigation, locale switching, generated downloads, OG images, collapsibles and changelog anchors.

## References

- [Void app types](https://void.cloud/guide/app-types)
- [Void config](https://void.cloud/reference/config)
- [Void Nuxt integration](https://void.cloud/integrations/frameworks/nuxt)
- [Vite+ migration rules](https://viteplus.dev/guide/migrate-rules)
- [Vite+ task runner](https://viteplus.dev/guide/run)
