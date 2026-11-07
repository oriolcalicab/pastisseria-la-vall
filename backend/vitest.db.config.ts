import { config } from 'dotenv'
import { defineConfig } from 'vitest/config'

const testEnv = config({ path: '.env.test' }).parsed ?? {}

export default defineConfig({
  test: {
    include: ['src/**/*.db.test.ts'],
    env: testEnv,
    fileParallelism: false,
    testTimeout: 30_000,
  },
})
