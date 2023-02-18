import { expect, it } from 'vitest';

import { parse } from '../parse.js';
import type { ParseOptions } from '../types.js';

interface TestParams {
  expected: string | object | unknown[];
  options?: ParseOptions;
  params: string;
}

it.each<TestParams>([
  {
    params: '',
    expected: {},
  },
  {
    params: 'a=a',
    expected: { a: 'a' },
  },
  {
    params: 'a=a&a=b',
    expected: { a: ['a', 'b'] },
  },
  {
    params: 'a=a&b=b',
    expected: { a: 'a', b: 'b' },
  },

  // nested
  {
    params: 'a.a=a',
    expected: { a: { a: 'a' } },
  },
  {
    params: 'a.a=a&a.a=b',
    expected: { a: { a: ['a', 'b'] } },
  },
  {
    params: 'a.a=a&a.b=b',
    expected: { a: { a: 'a', b: 'b' } },
  },
  {
    params: 'a.a.a=a',
    expected: { a: { a: { a: 'a' } } },
  },
  {
    params: 'a[a]=a',
    expected: { a: { a: 'a' } },
  },
  {
    params: 'a[a]=a&a[a]=b',
    expected: { a: { a: ['a', 'b'] } },
  },
  {
    params: 'a[a]=a&a[b]=b',
    expected: { a: { a: 'a', b: 'b' } },
  },
  {
    params: 'a[a][a]=a',
    expected: { a: { a: { a: 'a' } } },
  },

  // comma separated
  {
    params: 'a=a,b',
    expected: { a: ['a', 'b'] },
  },
  {
    params: 'a=a,b&a=c',
    expected: { a: ['a', 'b', 'c'] },
  },
  {
    params: 'a=a,b&b=b',
    expected: { a: ['a', 'b'], b: 'b' },
  },
  {
    params: 'a=a,b&b=b&a=c',
    expected: { a: ['a', 'b', 'c'], b: 'b' },
  },

  // nested, comma separated
  {
    params: 'a.a=a,b',
    expected: { a: { a: ['a', 'b'] } },
  },
  {
    params: 'a.a=a,b&a.a=c',
    expected: { a: { a: ['a', 'b', 'c'] } },
  },
  {
    params: 'a.a=a,b&a.a=c,d',
    expected: { a: { a: ['a', 'b', 'c', 'd'] } },
  },
  {
    params: 'a.a=a,b&a.b=c,d&b=b',
    expected: { a: { a: ['a', 'b'], b: ['c', 'd'] }, b: 'b' },
  },
  {
    params: 'a.a.a=a,b',
    expected: { a: { a: { a: ['a', 'b'] } } },
  },
  {
    params: 'a[a][a]=a,b',
    expected: { a: { a: { a: ['a', 'b'] } } },
  },

  // mixed nested
  {
    params: 'a.a=a,b&a[b].c=c,d&a.c[b]=e',
    expected: { a: { a: ['a', 'b'], b: { c: ['c', 'd'] }, c: { b: 'e' } } },
  },

  // overridden
  {
    params: 'a.a=a&a=a',
    expected: { a: 'a' },
  },

  // single value with optional replacer function
  {
    params: 'a=a&a=b',
    expected: { a: 'a' },
    options: {
      replacer({ firstRawValue: [fv], key, value }) {
        if (key === 'a') return fv;
        return value;
      },
    },
  },
  {
    params: 'a=a,b&a=a',
    expected: { a: ['a', 'b'] },
    options: {
      replacer({ firstRawValue, key, value }) {
        if (key === 'a') return firstRawValue;
        return value;
      },
    },
  },
  {
    params: 'a.a=a&a[a]=b',
    expected: { a: { a: 'a' } },
    options: {
      replacer({ firstRawValue: [fv], key, value }) {
        if (key === 'a.a') return fv;
        return value;
      },
    },
  },

  // always array with optional replacer function
  {
    params: 'a=a',
    expected: { a: ['a'] },
    options: {
      replacer({ rawValue }) {
        return rawValue;
      },
    },
  },
  {
    params: 'a.a=a&a.b=b',
    expected: { a: { a: ['a'], b: ['b'] } },
    options: {
      replacer({ rawValue }) {
        return rawValue;
      },
    },
  },
  {
    params: 'a=1&b.a=true&c=symbol:a&d=1,2,3&e=&f=null&g=undefined',
    expected: {
      a: 1,
      b: { a: true },
      c: Symbol.for('a'),
      d: [1, 2, 3],
      e: undefined,
      f: null,
      g: undefined,
    },
    options: {
      replacer({ firstRawValue, key, rawValue, value }) {
        const [fv] = firstRawValue;

        switch (key) {
          case 'a': return Number(firstRawValue);
          case 'b.a': return fv === 'true';
          case 'c': return Symbol.for(fv?.split(':').at(1) as string);
          case 'd': return rawValue.map(n => Number(n));
          case 'e': return fv === '' ? undefined : fv;
          case 'f': return fv === 'null' ? null : fv;
          case 'g': return fv === 'undefined' ? undefined : fv;
          default: return value;
        }
      },
    },
  },
])('parses $params (options: $options)', ({ expected, options, params }) => {
  const searchParams = new URLSearchParams(params);
  const result = parse(searchParams, options?.replacer);

  expect(result).toEqual(expected);
});
