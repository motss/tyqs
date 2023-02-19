import { bench } from 'vitest';

import { stringify } from '../stringify.js';
import { testCasesForStringify } from '../tests/constants.js';

testCasesForStringify
  .map(({ input, options }) => ({ input, options }))
  .forEach(({ input, options }) => {
    const paramName1 = input === '' ? '<empty_string>' : JSON.stringify(input);
    const paramName2 = options?.replacer && '[Function replacer]';
    const benchName = `${stringify.name}(${paramName1}, ${paramName2})`;

    bench(benchName, () => {
      stringify(input, options?.replacer);
    });
  });
