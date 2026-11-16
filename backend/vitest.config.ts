import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    exclude: [...configDefaults.exclude, '**/*.db.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.test.ts', 'src/generated/**', 'src/index.ts', 'src/test/**'],
      reporter: ['text-summary', 'html'],
      thresholds: { lines: 20, statements: 20, functions: 20, branches: 20 },
    },
  },
})
