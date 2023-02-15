import { expect, it } from 'vitest';

import { parse } from '../parse.js';
import type { ParseOptions } from '../types.js';

interface TestParams {
  params: string;
  options?: ParseOptions;
  expected: string | object | unknown[];
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
  // singles
  {
    params: 'a=a&a=b',
    expected: { a: 'a' },
    options: { singles: ['a'] },
  },
  {
    params: 'a=a,b&a=a',
    expected: { a: ['a', 'b'] },
    options: { singles: ['a'] },
  },
  {
    params: 'a.a=a&a[a]=b',
    expected: { a: { a: 'a' } },
    options: { singles: ['a.a'] },
  },
  // smart disabled
  {
    params: 'a=a',
    expected: { a: ['a'] },
    options: { smart: false },
  },
  {
    params: 'a=a,b',
    expected: { a: ['a', 'b'] },
    options: { smart: false },
  },
  {
    params: 'a=a&a=b',
    expected: { a: ['a', 'b'] },
    options: { smart: false },
  },
  {
    params: 'a=a,b',
    expected: { a: ['a', 'b'] },
    options: { smart: false },
  },
  {
    params: 'a.a=a&a.b=b',
    expected: { a: { a: ['a'], b: ['b'] } },
    options: { smart: false },
  },
])('parses $params ($options)', ({ expected, options, params }) => {
  const searchParams = new URLSearchParams(params);
  const result = parse(searchParams, options);

  expect(result).toEqual(expected);
});
