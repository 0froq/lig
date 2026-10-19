import { defineConfig } from 'vite-plus'

// Keep tool configuration outside the root so Nuxt owns its Vite configuration.
export default defineConfig({
  // Core checks also run in fresh CI checkouts without Nuxt-generated references.
  tsconfig: 'core/tsconfig.json',
  test: {
    environment: 'node',
    include: ['core/tests/**/*.test.ts', 'syntax/tests/**/*.test.ts', 'ports/contracts.test.ts'],
  },
  lint: {
    categories: { correctness: 'error' },
    ignorePatterns: ['vendor/**', 'content/**', '**/generated/**', '.agents/**'],
  },
})
