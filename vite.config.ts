/// <reference types="vitest" />

import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    coverage: {
      exclude: [
        /**
         * NOTE: Code coverage always collect other files, e.g. `constants.ts` inside `tests` folder.
         */
        'src/{benchmarks,tests}/**',
      ],
      reporter: ['lcov', 'text'],
    },
  },
})
