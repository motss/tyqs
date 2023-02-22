import deepClone from 'lodash.clonedeep';
import { expect, it } from 'vitest';

import { stringify } from '../stringify.js';
import { testCasesForStringify } from './constants.js';

it.each(testCasesForStringify)(
  `${stringify.name}($input, $options.replacer)`,
  ({ expected, input, options}) => {
    const clonedInput = deepClone(input);
    const result = stringify(input, options?.replacer);

    expect(input).toEqual(clonedInput);
    expect(result).toBe(expected);
  }
);
