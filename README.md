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
- [Usage](#usage)
  - [TypeScript or ES Modules](#typescript-or-es-modules)
- [API Reference](#api-reference)
  - [parse(searchParams\[, options\])](#parsesearchparams-options)
  - [stringify(value\[, replacer\])](#stringifyvalue-replacer)
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

## Usage

### TypeScript or ES Modules

```ts
import { parse } from 'tyqs';

parse('a=a'); // { a: 'a' }
parse('a=a&a=b'); // { a: ['a', 'b'] }
parse('a=a,b'); // { a: ['a', 'b'] }
parse('a.a=a'); // { a: { a: 'a' } }
parse('a[a]=a'); // { a: { a: 'a' } }
parse('a[a].b=a'); // { a: { a: { b: 'a' } } }
parse('a[a].b=a,b'); // { a: { a: { b: ['a', 'b'] } } }
```

## API Reference

### parse(searchParams[, options])

- `searchParams` <[string][string-mdn-url] | [URLSearchParams]> URL search parameters.
- `options` <?[Object][object-mdn-url]> Optional parsing options.
  - `replacer` <?[Function][function-mdn-url]> Optional replacer function that allows you to alter the returned value.
  - `singles` <?[Array][array-mdn-url]<[string][string-mdn-url]>> Optional list of keys that need to be decoded as single string value instead of an array of values.
  - `smart` <?[boolean][boolean-mdn-url]> Defaults to true. The decoder will assume all URL search params to be an array of values. With smart mode enabled, it will not force a single-value search param into an array.
- returns: <[Object][object-mdn-url]> An object of decoded URL search params from a given string.

This method decodes/ parses a string value into an object.

### stringify(value[, replacer])

- `value` <`unknown`> Any value of unknown type. It accepts any JavaScript primitives and objects.
- `replacer` <?[Function][function-mdn-url]> Optional replacer function that allows you to alter the returned value.
    - `init` <[Object][object-mdn-url]> Function parameters.
      - `flattenedKey` <[string][string-mdn-url]> Flattened key, e.g. *`{ a: { b: { c: 'a' } } }`'s key will be flattened to `a.b.c`*.
      - `key` <[string][string-mdn-url]> Raw key.
      - `rawValue` <`unknown`> Raw value of any type.
      - `value` <[string][string-mdn-url]> Stringified value.
- returns: <[string][string-mdn-url]> A string of encoded URL search params from a given input.

This method encodes/ stringifies an input into a string. When a raw value is nullish, it will be omitted in the stringified output, e.g. *`{ a: null, b: undefined }` will return `''` as `null` and `undefined` are nullish values*.

If you want to include nullish values in the stringified output, you can override that with an optional `replacer` function, like so:

```ts
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

function replacer({
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
}

stringify(input);
/** output: d=d%28%29+%7B+return%3B+%7D */

stringify(input, replacer);
/** output: a=&b=%3Cnil%3E&c.a=&c.d.a=%3Cnil%3E */
```

## Contributing

### Code of Conduct

Please note that this project is released with a [Contributor Code of Conduct][coc-url]. By participating in this project you agree to abide by its terms.

## License

[MIT License](http://motss.mit-license.org/) © Rong Sen Ng (motss)



<!-- References -->
[ES Modules]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
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
