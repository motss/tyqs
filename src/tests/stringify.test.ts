import { expect, it } from 'vitest';

import { stringify } from '../stringify.js';
import { testCasesForStringify } from './constants.js';

it.each(testCasesForStringify)(
  `${stringify.name}($input, $options.replacer)`,
  ({ expected, input, options}) => {
    const result = stringify(input, options?.replacer);

    expect(result).toBe(expected);
  }
);
