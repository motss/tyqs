import { bench } from 'vitest';

import { parse } from '../parse.js';

bench('<empty_string>', () => {
  parse('');
});

[
  'a=a',
  'a=a&a=b',
  'a.a=a',
  'a.a=a&a.a=b',
  'a.a=a&a.b=b',
  'a[a]=a',
  'a[a]=a&a[a]=b',
  'a[a]=a&a[b]=b',
  'a=a,b',
  'a=a,b&a=c',
  'a=a,b&b=b',
  'a=a,b&b=b&a=c',
  'a.a=a,b',
  'a.a=a,b&a.a=c',
  'a.a=a,b&a.a=c,d',
  'a.a=a,b&a.b=c,d&b=b',
  'a.a=a,b&a[b].c=c,d&a.c[b]=e',
  'a.a=a&a=a',
].forEach((value) => {
  bench(value, () => {
    parse(value);
  });
});

([
  [
    'a=a&a=b',
    ['a'],
  ],
  [
    'a=a,b&a=a',
    ['a'],
  ],
  [
    'a.a=a&a[a]=b',
    ['a.a'],
  ],
] as [string, string[]][]).forEach(([value, singles]) => {
  bench(`${value};options.singles=${singles.join(',')}`, () => {
    parse(value, { singles });
  });
});

[
  'a=a',
  'a=a&a=b',
  'a=a,b',
  'a.a=a&a.b=b',
].forEach((value) => {
  bench(`${value};options.smart=false`, () => {
    parse(value, { smart: false });
  });
});
