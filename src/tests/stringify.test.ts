import { expect, it } from 'vitest';

import { stringify } from '../stringify.js';
import { ToJsonClass } from './constants.js';

interface TestParams {
  expected: string;
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
    expected: 'a=a&b=0&c=true&d=Symbol%28%29&e=undefined&f=null',
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
