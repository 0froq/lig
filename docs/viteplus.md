# Vite+ tooling and cf deployment

## Status

Nuxt owns rendering and static generation. Vite+ 1.3.0 supplies the Vite core, task runner, Vitest, Oxlint and Oxfmt. The project no longer uses ESLint.

Production and branch previews use cf. The Void deployment trial was rolled back after a static asset policy mismatch. The user chose to retain cf and remove the Void deployment configuration and dependency. `into-the-void` is a separate user-added package and remains unchanged.

The pre-migration workspace is archived on `origin/main` at `1dcb041`. Historical plans describe the trial, not the current deployment contract.

## Runtime and commands

Use Node 24.21.0, pinned by `.node-version` and `mise.toml`. Workers Builds production and preview use the same version.

```sh
mise exec node@24.21.0 -- pnpm install --frozen-lockfile
mise exec node@24.21.0 -- pnpm exec vp run dev
```

Project checks and generation:

```sh
pnpm exec vp run typecheck
pnpm exec vp run lint
pnpm exec vp run fmt:check
pnpm exec vp run fmt
pnpm exec vp run check:core
pnpm exec vp run ports:generate
pnpm exec vp run test
pnpm exec vp run generate
```

Use `vp run`, not the built-in `vp dev`, `vp build` or `vp check`. Those built-in commands do not run this project's Nuxt scripts or combined checks. Nuxt continues to own the application's Vite configuration via `nuxt.config.ts`. Root `vite.config.ts` is the Vite+ tool config (`liangmi()` for lint, fmt and Vitest). Nuxt ignores that file; the B5004 warning is expected.

The workspace override aligns Nuxt with Vite+'s Vite core. The `trustPolicy: no-downgrade` policy and cssnano override remain in place. `@liangmi/vp-config` and its Oxlint flat-config dependencies are listed in `trustPolicyExclude` because they are first publishes.

## Tests, lint and formatting

Tests use the root `vite.config.ts`. The transformer explicitly uses `core/tsconfig.json`, so core and port checks do not require generated `.nuxt` TypeScript references.

`test` generates port artifacts, then runs all 48 existing non-UI token, syntax and port tests once. The ports aggregator imports its lightweight and Zed suites, which are not discovered a second time. Native syntax checks need the Neovim and parser revisions from `syntax/manifest.json`. See `syntax/README.md`.

Oxlint and Oxfmt read the `lint` and `fmt` blocks from root `vite.config.ts`, via `@liangmi/vp-config` (`liangmi()`). Lig-specific ignores stay in that file. Vue type checking still uses `nuxt typecheck`; Oxlint type-aware checking stays off so `tokens` CI can lint without `.nuxt`. ESLint-only Nuxt rules, unsupported Vue template rules, package catalog lint enforcement and Antfu style checks are no longer run.

Vendored UI, MDC content, public/generated artifacts, fixtures, historical plans and agent instructions are excluded from application-wide formatting. The vendored library retains its upstream conventions.

Three local `prettier-ignore` comments protect whitespace-sensitive SVG plots and a multi-statement Vue event handler from formatter changes. VS Code recommends `oxc.oxc-vscode`.

Some third-party packages retain ESLint peer dependencies. That does not enable a project ESLint check.

The existing `lint-staged` hook runs `vp lint --fix` and `vp fmt`, which now load `vite.config.ts`. The preset's `vp check --fix` staged task is excluded: this site's check is lint plus fmt plus `nuxt typecheck`, not built-in `vp check`.

`build` and `generate` explicitly run `ports:generate` before Nuxt. Task caching remains disabled, especially for generation and deployment.

## Deployment

`cloudflare.config.ts` is the Worker configuration source for production and previews. `wrangler.config.ts` only configures the build-side static assets directory, `dist`. cf currently delegates this static build to the installed Wrangler package. Keep both the dependency and that small configuration file. All deployment commands use cf.

Local production deployment builds once, then publishes:

```sh
pnpm deploy
```

This runs `pnpm generate && cf deploy`. cf packages the generated assets but does not run the Nuxt generation script itself.

Local branch previews:

```sh
pnpm preview:deploy
```

Keep the existing Cloudflare Workers Builds GitHub connection and managed credentials:

| Setting        | Production            | Branch previews                |
| -------------- | --------------------- | ------------------------------ |
| Node           | `24.21.0`             | `24.21.0`                      |
| Build command  | `pnpm generate`       | `pnpm generate`                |
| Deploy command | `pnpm exec cf deploy` | `pnpm exec cf previews deploy` |

Do not use `pnpm deploy` in the split Workers Builds flow, since the build step has already generated the site. GitHub Actions only runs checks. No separate deployment workflow or repository API token is needed.

The existing custom domain is `lig.froq.me`. cf configuration leaves the dashboard-managed domain and visibility settings unchanged. Native branch previews keep a stable branch URL and do not publish the production domain.

Use `drop-trailing-slash` and `404-page`. Directory-index HTML files serve at Nuxt's slashless route URLs, trailing-slash requests redirect to them, and missing paths return 404. This matches the existing production policy and the application's canonical URLs. The temporary `auto-trailing-slash` preview policy is no longer selected.

Validate packaging without publishing:

```sh
pnpm exec cf deploy --dry-run
```

No browser UI tests are used. After deployment, manually check nested-page navigation and refresh, locale switching and downloads. Existing PostCSS font-expression and OG compatibility warnings are outside this tooling change.

## References

- [cf project builds and deployment](https://developers.cloudflare.com/cf/projects/)
- [Vite+ migration rules](https://viteplus.dev/guide/migrate-rules)
- [Vite+ task runner](https://viteplus.dev/guide/run)
