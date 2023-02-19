import { bench } from 'vitest';

import { parse } from '../parse.js';
import { testCasesForParse } from '../tests/constants.js';

testCasesForParse
  .map(({ params, options }) => ({ params, options }))
  .forEach(({
    params,
    options,
  }) => {
    const paramName1 = params === '' ? '<empty_string>' : params;
    const paramName2 = options?.replacer && '[Function replacer]';
    const benchName = `${parse.name}(${paramName1}, ${paramName2})`;

    bench(benchName, () => {
      parse(params, options?.replacer);
    });
  });
