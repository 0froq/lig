# Void and Vite+

## Migration status

The pre-migration workspace is archived on `origin/main` at `1dcb041`.

- Nuxt uses Vite+ 1.3.0's Vite core through the workspace override. Its bundled Vite is 8.3.4, matching the previous Vite version.
- Vite+'s task runner runs existing scripts. Nuxt still owns rendering and static generation.
- Void 1.1.12 is available through `deploy:void`. Its configuration selects a static `dist` deployment, not Nuxt's SSR adapter.
- Production `deploy` and branch `preview:deploy` still use `cf`. The Void command has not been run against the live Worker.
- ESLint, TypeScript, Vue type checking, node-based tests, Python distribution checks and Git hooks remain unchanged.

The full `vp migrate` setup was deliberately not applied. It also changes linting, hooks, editor and agent configuration. This migration instead applies the documented aligned core override and pinned tool versions while retaining those project contracts. The vendored UI is not a workspace package and is not migrated.

## Runtime

Use Node 24.21.0. The supported range shared by Void and Vite+ is `^24.21.0 || >=26.0.0`. `.node-version` pins the version used by both GitHub workflows.

With mise:

```sh
mise exec node@24.21.0 -- pnpm install --frozen-lockfile
mise exec node@24.21.0 -- pnpm exec vp run dev
```

Workers Builds must also set `NODE_VERSION=24.21.0` before deploying this migration. The dashboard setting has not been changed by this work.

The exact-version `minimumReleaseAgeExclude` entries were added by pnpm for Void's newly published packages. The existing `trustPolicy: no-downgrade` and cssnano override are retained.

## Commands

```sh
pnpm exec vp run dev
pnpm exec vp run typecheck
pnpm exec vp run check:core
pnpm exec vp run generate
```

Use `vp run`, not the built-in `vp dev`, `vp build` or `vp check`. The built-in commands do not run this project's Nuxt and ESLint scripts.

`build` and `generate` explicitly run `ports:generate` before Nuxt. They no longer depend on package-manager lifecycle hooks, which are not a portable assumption when using another task runner.

Task caching remains disabled. In particular, generation and deployment must not replay cached output without restoring the generated assets.

## Deployment

The existing validated deployment remains:

```sh
pnpm deploy
pnpm preview:deploy
pnpm exec cf deploy --dry-run
```

The prepared Void path is:

```sh
pnpm exec void prepare
pnpm deploy:void
```

`void prepare` generates local artifacts without deploying. `deploy:void` generates the complete static site, then runs `void deploy --platform cloudflare --dir dist`. It is a real deployment to the configured `lig` Worker, not a preview or dry-run.

`void.config.ts` derives the Worker name, compatibility date, observability and asset routing from `cloudflare.config.ts`. There is no second set of hand-maintained deployment values. Authentication uses Void's documented Cloudflare connection flow or CI credentials. Do not commit credentials or `.env` files.

Void currently exposes no deploy dry-run flag. Its CLI also has no documented equivalent of `cf previews deploy` for the existing Workers Builds branch-preview flow. Keep `cf` as the default until a real Void deployment has verified existing Worker ownership, custom-domain retention, headers, trailing-slash handling, localized URLs and missing-page status codes.

Do not change the production or preview deployment commands in Workers Builds yet. Keep build command `pnpm generate`, production deployment `pnpm exec cf deploy`, and preview deployment `pnpm exec cf previews deploy`.

After a real Void deployment creates `void.lock.json`, review and commit it. Do not invent a lockfile before resource IDs are resolved.

## Checks

Validated with Node 24.21.0:

- Vite+ core and syntax checks: 21 token tests and 5 syntax tests, both TypeScript projects and generated-file checks.
- Port checks: 22 contract tests, port TypeScript project and 121 generated artifacts.
- Python distribution tests: 12 tests.
- VS Code and Zed generated-package checksum verification.
- Nuxt type checking and static generation: 80 prerendered routes.
- `void prepare` and the existing `cf deploy --dry-run`.
- Frozen-lockfile installation, project ESLint and `git diff --check`.

Static generation reports a PostCSS warning for the homepage's nested `calc`/`clamp` font-size expression. It is outside this tooling migration. OG image compatibility warnings also appear during type preparation.

No browser UI tests or production deployment were run. Manually check page navigation, locale switching, generated downloads, OG images, collapsibles and changelog anchors before landing the migration.

## References

- [Void app types](https://void.cloud/guide/app-types)
- [Void config](https://void.cloud/reference/config)
- [Void Nuxt integration](https://void.cloud/integrations/frameworks/nuxt)
- [Vite+ migration rules](https://viteplus.dev/guide/migrate-rules)
- [Vite+ task runner](https://viteplus.dev/guide/run)
