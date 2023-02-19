import { expect, it } from 'vitest';

import { parse } from '../parse.js';
import { testCasesForParse } from './constants.js';

it.each(testCasesForParse)(
  `${parse.name}($params, $options.replacer)`,
  ({ expected, options, params }) => {
    const searchParams = new URLSearchParams(params);
    const result = parse(searchParams, options?.replacer);

    expect(result).toEqual(expected);
  }
);
