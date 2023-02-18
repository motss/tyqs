<div align="center" style="text-align: center;">
  <h1 style="border-bottom: none;">tyqs</h1>

  <p>Tiny and type-safe querystring library for the web</p>
</div>

<hr />

[![Buy me a coffee][buy-me-a-coffee-badge]][buy-me-a-coffee-url]
[![Follow me][follow-me-badge]][follow-me-url]

[![npm-latest][npm-latest-badge]][npm-latest-url]
[![MIT License][mit-license-badge]][mit-license-url]

[![Downloads][downloads-badge]][downloads-url]
[![Total downloads][total-downloads-badge]][downloads-url]

[![Dependencies][dependencies-badge]][dependencies-url]
[![ci][ga-ci-badge]][ga-ci-url]
[![publish][ga-publish-badge]][ga-publish-url]
[![codecov][codecov-badge]][codecov-url]

[![Code of Conduct][coc-badge]][coc-url]

> Querystring decoder and encoder using [URLSearchParams].

## Table of contents <!-- omit in toc -->

- [Pre-requisite](#pre-requisite)
- [Install](#install)
- [Features](#features)
- [Usage](#usage)
  - [TypeScript or ES Modules](#typescript-or-es-modules)
  - [Optional replacer function](#optional-replacer-function)
- [API Reference](#api-reference)
  - [parse(searchParams\[, replacer\])](#parsesearchparams-replacer)
  - [stringify(input\[, replacer\])](#stringifyinput-replacer)
- [Contributing](#contributing)
  - [Code of Conduct](#code-of-conduct)
- [License](#license)

## Pre-requisite

- [ES Modules]


## Install

```sh
# Install via NPM
$ npm i tyqs
```

## Features

| Support | Feature | Description | Example |
| --- | --- | --- | --- |
| ✅ | [parse] | Decodes URL search params into an object. | `parse('a=a&b=1')` returns `{ a: 'a', b: '1' }`. |
| ✅ | [stringify] | Encodes an object into URL search params. | `stringify({ a: 'a', b: 1 })` gives `a=a&b=1`. |
| ✅ | Parse multiple values | Parses comma-separated param into an array of values. | `parse('a=a,b')` returns `{ a: ['a', 'b'] }`. |
| ✅ | Parse single value | Parses single-value param into a string. | `parse('a=a')` returns `{ a: 'a' }`. |
| ✅ | Parse multiple params of the same name | Parses multiple params of the same name into an array of values. | `parse('a=a,b&a=c')` returns `{ a: ['a', 'b', 'c'] }`. |
| ✅ | Parse nested params | Parses nested params with dot or bracket notation. | `parse('a.a=a&b[a]=b&c[a].b=c&d.a[b].c=d')` returns `{ a: { a: 'a' }, b: { a: 'b' }, c: { a: { b: 'c' } }, d: { a: { b: { c: 'd' } } } }`. |
| ✅ | Stringify nested params | Stringifies nested params with dot or bracket notation. | `stringify({ a: { a: 'a' } } )` gives `a.a=a`. |
| ✅ | Optional replacer function for parsing | Optionally alters final parsed value. | See [Optional replacer function][optional-replacer-function-url]. |
| ✅ | Optional replacer function for stringify | Optionally alters final stringified value. | See [Optional replacer function][optional-replacer-function-url]. |
| ✅ | Omit nullish value in stringify | By default, all nullish values are omitted when stringify-ing an object. | `stringify({ a: 'a', b: undefined, c: null })` gives `a=a`. |
| ❌ | Parse `a[0]=a&a[1]=b` into array | Not supported but it should work. For arrays, use comma-separated value. | `parse('a[0]=a&a[1]=b')` returns `{ a: { 0: 'a', 1: 'b' } }`. |
| 🚧 | Stringify non-JavaScript primitives | Stringifies all non-JavaScript primitives with its best effort. | `stringify({ a() {return;} })` gives `a=a%28%29+%7Breturn%3B%7D`. |

## Usage

### TypeScript or ES Modules

```ts
import { parse, stringify } from 'tyqs';

parse('a=a'); // { a: 'a' }
parse('a=a&a=b'); // { a: ['a', 'b'] }
parse('a=a,b'); // { a: ['a', 'b'] }
parse('a.a=a'); // { a: { a: 'a' } }
parse('a[a]=a'); // { a: { a: 'a' } }
parse('a[a].b=a'); // { a: { a: { b: 'a' } } }
parse('a[a].b=a,b'); // { a: { a: { b: ['a', 'b'] } } }
parse('a=1'); // { a: '1' }
parse('a.a=1'); // { a: { a: '1' } }
parse('a.a[b]=1'); // { a: { a: { b: '1' } } }

stringify({ a: 'a' }); // a=a
stringify({ a: [1, 2] }); // a=1,2
stringify({ a: { a: [1, 2] } }); // a.a=1,2
stringify({ a: 'a', b: undefined, c: null }); // a=a
```

### Optional replacer function

All functions provided accepts an optional `replacer` function to alter the final output of each parameter.

```ts
// parse(searchParams, replacer)
const searchParams = new URLSearchParams('a=1,2,3&b=true&c=&a=4');
const parseOptions = {
  replacer({
    firstRawValue: [firstRawValue],
    key,
    rawValue,
    value,
  }) {
    switch (key) {
      case 'a': return rawValue.map(n => Number(n));
      case 'b': return firstRawValue === 'true';
      case 'c': return firstRawValue === '' ? undefined : firstRawValue;
      default: return value;
    }
  },
};

parse(searchParams);
/**
 * output:
 * {
 *   a: ['1', '2', '3', '4'],
 *   b: 'true',
 *   c: '',
 * }
 */

parse(searchParams, parseOptions.replacer);
/**
 * output:
 * {
 *   a: [1, 2, 3, 4],
 *   b: true,
 *   c: undefined,
 * }
 */



// stringify(input, replacer)
const input = {
  a: null,
  b: undefined,
  c: {
    a: null,
    d: {
      a: undefined,
    },
  },
  d() { return; }
};
const stringifyOptions = {
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
};

stringify(input);
/** output: d=d%28%29+%7B+return%3B+%7D */

stringify(input, stringifyOptions.replacer);
/** output: a=&b=%3Cnil%3E&c.a=&c.d.a=%3Cnil%3E */
```

## API Reference

### parse(searchParams[, replacer])

- `searchParams` <[string][string-mdn-url] | [URLSearchParams]> URL search parameters.
- `replacer` <?[Function][function-mdn-url]> Optional replacer function that allows you to alter the final parsed value.
  - `firstRawValue` <[Array][array-mdn-url]<[string][string-mdn-url]>> This returns an array of values of the first key-value pair of a given key, e.g. *`a=a&a=b` will return `{ a: ['a'] }`*.
  - `key` <[string][string-mdn-url]> Parameter name.
  - `rawValue` <[Array][array-mdn-url]<[string][string-mdn-url]>> This returns an array of values from all key-value pairs of the same key, e.g. *`a=a&a=b` will return `{ a: ['a', 'b'] }`*.
  - `value` <[string][string-mdn-url] | [Array][array-mdn-url]<[string][string-mdn-url]>> This returns the best value of a given parameter key which is heuristically determined by the library, e.g. *`a=a,b&b=a&a=c` will return `{ a: ['a', 'b', 'c'] }` (an array of values) and `b='a'` (single value)*.
- returns: <[Object][object-mdn-url]> An object of decoded URL search params from a given string.

This method decodes/ parses a string value into an object. By default, [URLSearchParams.prototype.getAll] is used to retrieve the values from all key-value pairs of the same name, e.g. *`a=a&a=b` will return `{ a: ['a', 'b'] }`*. As you can see, this approach will be able to get all param values when you define multiple pairs of the same key. However, there is a downside which is when you have just **1** key-value pair and you expect it to be a single-value param, say `a=a&b=b`, will give `{ a: ['a'], b: ['b'] }`. To avoid any confusion, the library automatically parses such single-value param into a single value instead, e.g. *`a=a&b=b` will always give `{ a: 'a', b: 'b' }`*.

Under some circumstances, you might want it to behave differently. For that you can alter the outcome with an [optional `replacer` function][optional-replacer-function-url].

### stringify(input[, replacer])

- `value` <`unknown`> Any value of unknown type. It accepts any JavaScript primitives and objects.
- `replacer` <?[Function][function-mdn-url]> Optional replacer function that allows you to alter the final stringified value.
  - `flattenedKey` <[string][string-mdn-url]> Flattened key, e.g. *`{ a: { b: { c: 'a' } } }`'s key will be flattened to `a.b.c`*.
  - `key` <[string][string-mdn-url]> Parameter name.
  - `rawValue` <`unknown`> Raw value of a parameter.
  - `value` <[string][string-mdn-url]> Stringified value.
- returns: <[string][string-mdn-url]> A string of encoded URL search params from a given object.

This method encodes/ stringifies an object into a string. When a raw value is nullish, it will be omitted in the stringified output, e.g. *`{ a: 'a', b: null, c: undefined }` will return `a=a` as `null` and `undefined` are nullish values*.

If you want to include nullish values in the stringified output, you can override that with an [optional `replacer` function][optional-replacer-function-url].

## Contributing

### Code of Conduct

Please note that this project is released with a [Contributor Code of Conduct][coc-url]. By participating in this project you agree to abide by its terms.

## License

[MIT License](http://motss.mit-license.org/) © Rong Sen Ng (motss)



<!-- References -->
[ES Modules]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
[optional-replacer-function-url]: #optional-replacer-function
[parse]: #parsesearchparams-replacer
[stringify]: #stringifyinput-replacer
[URLSearchParams.prototype.getAll]: https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/getAll
[URLSearchParams]: https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams

<!-- MDN -->
[array-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
[boolean-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean
[function-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function
[html-style-element-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLStyleElement
[map-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
[number-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number
[object-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object
[promise-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
[string-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String

<!-- Badges -->
[buy-me-a-coffee-badge]: https://img.shields.io/badge/buy%20me%20a-coffee-ff813f?logo=buymeacoffee&style=flat-square
[follow-me-badge]: https://img.shields.io/badge/follow-@igarshmyb-1d9bf0?logo=twitter&style=flat-square

[npm-latest-badge]: https://img.shields.io/npm/v/tyqs?color=blue&logo=npm&style=flat-square
[mit-license-badge]: https://img.shields.io/npm/l/tyqs?color=blue&style=flat-square

[downloads-badge]: https://img.shields.io/npm/dm/tyqs?style=flat-square
[total-downloads-badge]: https://img.shields.io/npm/dt/tyqs?label=total%20downloads&style=flat-square

[dependencies-badge]: https://img.shields.io/librariesio/release/npm/tyqs/latest?style=flat-square
[ga-ci-badge]: https://img.shields.io/github/actions/workflow/status/motss/tyqs/ci.yml?branch=main&label=ci&logo=githubactions&logoColor=white&style=flat-square
[ga-publish-badge]: https://img.shields.io/github/actions/workflow/status/motss/tyqs/publish.yml?branch=main&label=publish&logo=githubactions&logoColor=white&style=flat-square
[codecov-badge]: https://img.shields.io/codecov/c/github/motss/tyqs/main?label=codecov&logo=codecov&style=flat-square

[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ed55bb?style=flat-square

<!-- Links -->
[buy-me-a-coffee-url]: https://www.buymeacoffee.com/RLmMhgXFb
[follow-me-url]: https://twitter.com/igarshmyb?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=motss/tyqs

[npm-latest-url]: https://www.npmjs.com/package/tyqs/v/latest
[mit-license-url]: /LICENSE

[downloads-url]: http://www.npmtrends.com/tyqs

[dependencies-url]: https://libraries.io/npm/tyqs
[ga-ci-url]: https://github.com/motss/tyqs/actions/workflows/ci.yml
[ga-publish-url]: https://github.com/motss/tyqs/actions/workflows/publish.yml
[codecov-url]: https://codecov.io/gh/motss/tyqs/tree/main

[coc-url]: /code-of-conduct.md
