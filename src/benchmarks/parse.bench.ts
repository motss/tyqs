import { bench } from 'vitest';

import { parse } from '../parse.js';
import type { ParseOptions } from '../types.js';

interface BenchParams {
  value: string;
  options: ParseOptions;
}

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

// optional replacer function
([
  {
    options: {
      replacer({ firstRawValue: [fv], key, value }) {
        if (key === 'a' ) return fv;
        return value;
      },
    },
    value: 'a=a&a=b',
  },
  {
    options: {
      replacer({ firstRawValue, key, value }) {
        if (key === 'a' ) return firstRawValue;
        return value;
      },
    },
    value: 'a=a,b&a=b',
  },
  {
    options: {
      replacer({ firstRawValue: [fv], key, value }) {
        if (key === 'a.a') return fv;
        return value;
      },
    },
    value: 'a.a=a&a[a]=b',
  },
  {
    options: {
      replacer({ firstRawValue, key, value }) {
        if (key === 'a') return firstRawValue.map(n => Number(n));
        return value;
      },
    },
    value: 'a=1,2,3',
  },
  {
    options: {
      replacer({ firstRawValue, key, value }) {
        if (key === 'a') return firstRawValue.map(n => Number(n));
        if (key === 'b') return firstRawValue.at(0) === 'true';
        return value;
      },
    },
    value: 'a=1,2,3&b=true',
  },
  {
    options: {
      replacer({ firstRawValue: [fv], key, value }) {
        switch (key) {
          case 'a': return Number(fv);
          case 'b.a': return fv === 'true';
          case 'c': return fv === '' ? undefined : fv;
          case 'd': return fv === 'null' ? null : fv;
          case 'e': return fv === 'undefined' ? undefined : fv;
          default: return value;
        }
      },
    },
    value: 'a=1&b.a=true&c=&d=null&e=undefined',
  },
] as BenchParams[]).forEach(({
  options,
  value,
}) => {
  bench(`${value} (options: ${options})`, () => {
    parse(value, options.replacer);
  });
});
