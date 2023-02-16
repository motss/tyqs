import { bench } from 'vitest';

import { stringify } from '../stringify.js';
import { ToJsonClass } from '../tests/constants.js';

([
  [
    'a=a',
    { a: 'a' },
  ],
  [
    'a=a%2Cb',
    { a: ['a', 'b'] },
  ],
  [
    'a=a&b=0&c=true&d=Symbol%28%29&e=undefined&f=null',
    { a: 'a', b: 0, c: true, d: Symbol(), e: undefined, f: null },
  ],
  [
    'a.b=b',
    {
      a: {
        b: 'b',
      },
    },
  ],
  [
    'a.b=a%2Cb&a.c.d=1',
    {
      a: {
        b: ['a', 'b'],
        c: {
          d: 1,
        },
      },
    },
  ],
  [
    'a=%28%29+%3D%3E+true&b=async+%28%29+%3D%3E+true&c=function%28%29+%7B%0A++++++return%3B%0A++++%7D&d=async+function%28%29+%7B%0A++++++return%3B%0A++++%7D',
    { a: () => true, b: async () => true, c: function(){return;}, d: async function(){return;} },
  ],
  [
    'a=class+TestA+%7B%0A++++++%7D',
    { a: class TestA {} },
  ],
  [
    'a=a (toJsonClass)',
    { a: ToJsonClass },
  ],
  ['<empty_string>', ''],
  ['0', 0],
  ['null', null],
  ['undefined', undefined],
] as [string, unknown][]).forEach((
  [name, value]) => {
    bench(name, () => {
      stringify(value);
    });
  }
);
