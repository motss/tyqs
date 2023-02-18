import { expect, it } from 'vitest';

import { stringify } from '../stringify.js';
import type { StringifyOptions } from '../types.js';
import { ToJsonClass } from './constants.js';

interface TestParams {
  expected: string;
  options?: StringifyOptions;
  value: unknown;
}

it.each<TestParams>([
  // simple object
  {
    expected: 'a=a',
    value: { a: 'a' },
  },
  {
    expected: 'a=a%2Cb',
    value: { a: ['a', 'b'] },
  },
  {
    expected: 'a=a&b=0&c=true&d=Symbol%28%29',
    value: { a: 'a', b: 0, c: true, d: Symbol(), e: undefined, f: null },
  },

  // nested object
  {
    expected: 'a.b=b',
    value: {
      a: {
        b: 'b',
      },
    },
  },
  {
    expected: 'a.b=a%2Cb&a.c.d=1',
    value: {
      a: {
        b: ['a', 'b'],
        c: {
          d: 1,
        },
      },
    },
  },

  // class or function
  {
    /**
     * NOTE: In browser, `(function(){return;}).toString()` will return `'function%28%29%7Breturn%3B%7D'.`
    *
     * However, node@19 will automatically format all function with whitespace and newlines.
    *
     * @example
     * function(){return;} // will be formatted into the code shown below.
     * function () {
     *   return;
    *  }
     *
     *
     */
    expected: 'a=%28%29+%3D%3E+true&b=async+%28%29+%3D%3E+true&c=function%28%29+%7B%0A++++++return%3B%0A++++%7D&d=async+function%28%29+%7B%0A++++++return%3B%0A++++%7D',
    value: { a: () => true, b: async () => true, c: function(){return;}, d: async function(){return;} },
  },
  {
    expected: 'a=class+TestA+%7B%0A++++%7D',
    value: { a: class TestA {} },
  },
  {
    expected: 'a=a',
    value: { a: ToJsonClass },
  },

  // defaults to string for falsy values
  { expected: '', value: '' },
  { expected: '', value: 0 },
  { expected: '', value: null },
  { expected: '', value: undefined },
])('stringifies $value', ({
  expected,
  value,
}) => {
  const result = stringify(value);

  expect(result).toBe(expected);
});

it.each<TestParams>([
  {
    expected: 'a=a&b=1&c=1&d=&e=&f=Symbol%28%29&g=%5Bfunction+g%5D&h=%5Bfunction+h%5D&i=%5Bfunction+i%5D&j=%5Bfunction+j%5D',
    options: {
      replacer({ rawValue, value }) {
        const t = typeof(rawValue);

        if (t === 'function') return `[function ${(rawValue as () => unknown).name}]` ?? '[function]';
        if (t === 'boolean') return t ? '1' : '0';

        return rawValue == null ? '' : value;
      },
    },
    value: {
      a: 'a',
      b: 1,
      c: true,
      d: null,
      e: undefined,
      f: Symbol(),
      g() { return; },
      async h() { return; },
      i: () => true,
      j: async () => true,
    },
  },
  {
    expected: 'a=&b=%3Cnil%3E&c.a=&c.d.a=%3Cnil%3E',
    options: {
      replacer({
        rawValue,
        value,
        key,
        flattenedKey,
      }) {
        if (key === 'b' || flattenedKey === 'c.d.a') return '<nil>';
        if (rawValue == null) return '';

        /** Returning a nullish value to omit the current key-value pair in the output. */
        if (typeof(rawValue) === 'function') return;

        return value;
      },
    },
    value: {
      a: null,
      b: undefined,
      c: {
        a: null,
        d: {
          a: undefined,
        },
      },
      d() { return; },
    },
  },
])('stringifies $value with optional replacer function', ({ expected, options, value}) => {
  const result = stringify(value, options?.replacer);

  expect(result).toBe(expected);
});
