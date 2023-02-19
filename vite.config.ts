/// <reference types="vitest" />

import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    coverage: {
      exclude: [
        /**
         * NOTE: Code coverage collects other files inside `tests` folder, e.g. `constants.ts` but
         * those are not needed in code coverage report.
         */
        'src/{benchmarks,tests}/**',
      ],
      reporter: ['lcov', 'text'],
    },
  },
})
