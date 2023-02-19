import type { ParseOptions, StringifyOptions } from '../types.js';

interface TestParamsForParse {
  expected: string | object | unknown[];
  options?: ParseOptions;
  params: string;
}

interface TestParamsForStringify {
  expected: string;
  input: unknown;
  options?: StringifyOptions;
}

class ToJsonClass {
  static toJSON() {
    return 'a';
  }
}

export const testCasesForParse: TestParamsForParse[] = [
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

  // optional replacer function
  {
    params: 'a=1',
    expected: { a: 1 },
    options: {
      replacer({ firstRawValue: [fv], key }) {
        if (key === 'a') return Number(fv);
        return fv;
      },
    },
  },
  {
    params: 'a=a&b=1',
    expected: { a: ['a'], b: 1 },
    options: {
      replacer({ firstRawValue: [fv], key, rawValue }) {
        if (key === 'b') return Number(fv);
        return rawValue;
      },
    },
  },
  {
    params: 'a.a=a&a.b=1',
    expected: { a: { a: 'a', b: 1 } },
    options: {
      replacer({ firstRawValue: [fv], key }) {
        if (key === 'a.b') return Number(fv);
        return fv;
      },
    },
  },
  {
    params: 'a.a=a&a.b=1,2',
    expected: { a: { a: 'a', b: [1, 2] } },
    options: {
      replacer({ firstRawValue, key }) {
        if (key === 'a.b') return firstRawValue.map(n => Number(n));
        return firstRawValue.at(0);
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
      replacer({ firstRawValue: [fv], key, rawValue, value }) {
        switch (key) {
          case 'a': return Number(fv);
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
];

export const testCasesForStringify: TestParamsForStringify[] = [
  // simple object
  {
    expected: 'a=a',
    input: { a: 'a' },
  },
  {
    expected: 'a=a%2Cb',
    input: { a: ['a', 'b'] },
  },
  {
    expected: 'a=a&b=0&c=true&d=Symbol%28%29',
    input: { a: 'a', b: 0, c: true, d: Symbol(), e: undefined, f: null },
  },

  // nested object
  {
    expected: 'a.b=b',
    input: {
      a: {
        b: 'b',
      },
    },
  },
  {
    expected: 'a.b=a%2Cb&a.c.d=1',
    input: {
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
    input: { a: () => true, b: async () => true, c: function(){return;}, d: async function(){return;} },
  },
  {
    expected: 'a=class+TestA+%7B%0A++++%7D',
    input: { a: class TestA {} },
  },
  {
    expected: 'a=a',
    input: { a: ToJsonClass },
  },

  // defaults to string for falsy values
  { expected: '', input: '' },
  { expected: '', input: 0 },
  { expected: '', input: null },
  { expected: '', input: undefined },

  // optional replacer function
  {
    expected: 'a=a&b=1&c=1&d=&e=&f=Symbol%28%29&g=%5Bfunction+g%5D&h=%5Bfunction+h%5D&i=%5Bfunction+i%5D&j=%5Bfunction+j%5D',
    input: {
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
    options: {
      replacer({ rawValue, value }) {
        const t = typeof(rawValue);

        if (t === 'function') return `[function ${(rawValue as () => unknown).name}]` ?? '[function]';
        if (t === 'boolean') return t ? '1' : '0';

        return rawValue == null ? '' : value;
      },
    },
  },
  {
    expected: 'a=&b=%3Cnil%3E&c.a=&c.d.a=%3Cnil%3E',
    input: {
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
  },
];
