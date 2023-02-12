<div align="center" style="text-align: center;">
  <h1 style="border-bottom: none;">tqs</h1>

  <p>Tiny and type-safe querystring library for the web</p>
</div>

<hr />

[![Follow me][follow-me-badge]][follow-me-url]

[![Version][version-badge]][version-url]
[![MIT License][mit-license-badge]][mit-license-url]

[![Downloads][downloads-badge]][downloads-url]
[![Total downloads][total-downloads-badge]][downloads-url]
[![Packagephobia][packagephobia-badge]][packagephobia-url]
[![Bundlephobia][bundlephobia-badge]][bundlephobia-url]

[![ci][ga-badge]][ga-url]
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
- [Contributing](#contributing)
  - [Code of Conduct](#code-of-conduct)
- [License](#license)

## Pre-requisite

- [ES Modules]


## Install

```sh
# Install via NPM
$ npm i tqs
```

## Usage

### TypeScript or ES Modules

```ts
import { parse } from 'tqs';

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
- `options` <?[object][object-mdn-url]> Optional parsing options.
  - `singles` <?[Array][array-mdn-url]<[string][string-mdn-url]>> A list of keys that need to be decoded as single string value instead of an array of values.
  - `smart` <?[boolean][boolean-mdn-url]> Defaults to true. The decoder will assume all URL search params to be an array of values. With smart mode enabled, it will not force a single-value search param into an array.
- returns: <[object][object-mdn-url]> An object of decoded URL search params from a given string.

This method decodes/ parses a string value into an object.

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
[map-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
[string-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String
[object-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object
[number-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number
[boolean-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean
[html-style-element-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLStyleElement
[promise-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise

<!-- Badges -->
[follow-me-badge]: https://flat.badgen.net/twitter/follow/igarshmyb?icon=twitter

[version-badge]: https://flat.badgen.net/npm/v/tqs?icon=npm
[mit-license-badge]: https://flat.badgen.net/npm/license/tqs

[downloads-badge]: https://flat.badgen.net/npm/dm/tqs
[total-downloads-badge]: https://flat.badgen.net/npm/dt/tqs?label=total%20downloads
[packagephobia-badge]: https://flat.badgen.net/packagephobia/install/tqs
[bundlephobia-badge]: https://flat.badgen.net/bundlephobia/minzip/tqs

[ga-badge]: https://github.com/motss/tqs/actions/workflows/ci.yml/badge.svg
[codecov-badge]: https://flat.badgen.net/codecov/c/github/motss/tqs?label=codecov&icon=codecov

[coc-badge]: https://flat.badgen.net/badge/code%20of/conduct/pink

<!-- Links -->
[follow-me-url]: https://twitter.com/igarshmyb?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=motss/tqs

[version-url]: https://www.npmjs.com/package/tqs
[mit-license-url]: /LICENSE

[downloads-url]: http://www.npmtrends.com/tqs
[packagephobia-url]: https://packagephobia.now.sh/result?p=tqs
[bundlephobia-url]: https://bundlephobia.com/result?p=tqs

[ga-url]: https://github.com/motss/tqs/actions/workflows/ci.yml
[codecov-url]: https://codecov.io/gh/motss/tqs

[coc-url]: /code-of-conduct.md
