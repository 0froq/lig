import { liangmi } from '@liangmi/vp-config'

// Vite+ loads lint, fmt and test from this root file. Nuxt ignores it and owns
// application Vite via `nuxt.config.ts` (the B5004 warning is expected).
const ligLintIgnores = ['vendor/**', 'content/**', '**/generated/**', '.agents/**']

const ligFmtIgnores = [
  ...ligLintIgnores,
  'public/**',
  '**/fixtures/**',
  'docs/plans/**',
  'AGENTS.md',
  'pnpm-lock.yaml',
  'skills-lock.json',
]

export default liangmi({
  // Core checks also run in fresh CI checkouts without Nuxt-generated references.
  tsconfig: 'core/tsconfig.json',
  test: {
    environment: 'node',
    include: ['core/tests/**/*.test.ts', 'syntax/tests/**/*.test.ts', 'ports/contracts.test.ts'],
  },
  lint: [
    {
      name: 'lig/ignores',
      ignores: ligLintIgnores,
    },
    {
      // Preset rules that do not match this Nuxt site's existing source.
      // Keep the PR on the toolchain; do not rewrite application code to the
      // style/restriction allowlist in one step.
      name: 'lig/compat',
      rules: {
        'eqeqeq': 'off',
        'import/extensions': 'off',
        'import/no-cycle': 'off',
        'import/no-unassigned-import': 'off',
        'no-array-for-each': 'off',
        'no-negated-condition': 'off',
        'no-underscore-dangle': 'off',
        'no-useless-assignment': 'off',
        'node/no-sync': 'off',
        'oxc/approx-constant': 'off',
        'oxc/no-map-spread': 'off',
        'prefer-import-meta-properties': 'off',
        'unicorn/consistent-function-scoping': 'off',
        'unicorn/explicit-length-check': 'off',
        'unicorn/no-array-reverse': 'off',
        'unicorn/no-array-sort': 'off',
        'unicorn/prefer-query-selector': 'off',
        'unicorn/prefer-string-replace-all': 'off',
      },
    },
    {
      name: 'lig/scripts',
      files: ['**/scripts/**'],
      rules: {
        'no-console': 'off',
      },
    },
  ],
  fmt: {
    quoteProps: 'consistent',
    singleAttributePerLine: true,
    htmlWhitespaceSensitivity: 'strict',
    trailingComma: 'all',
    sortImports: false,
    sortPackageJson: false,
    ignorePatterns: ligFmtIgnores,
  },
})
  .exclude(['pack', 'test', 'staged'])
  .option([
    {
      path: '.',
      node: true,
      browser: true,
      vue: true,
      react: false,
    },
  ])
  .remove('liangmi/style')
  .override('liangmi/options', {
    options: {
      typeAware: false,
      typeCheck: false,
    },
  })
