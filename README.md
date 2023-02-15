<div align="center" style="text-align: center;">
  <h1 style="border-bottom: none;">tyqs</h1>

  <p>Tiny and type-safe querystring library for the web</p>
</div>

<hr />

<a href="https://www.buymeacoffee.com/RLmMhgXFb" target="_blank" rel="noopener noreferrer"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 20px !important;width: auto !important;" ></a>
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
  - [stringify(value)](#stringifyvalue)
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
- `options` <?[object][object-mdn-url]> Optional parsing options.
  - `singles` <?[Array][array-mdn-url]<[string][string-mdn-url]>> A list of keys that need to be decoded as single string value instead of an array of values.
  - `smart` <?[boolean][boolean-mdn-url]> Defaults to true. The decoder will assume all URL search params to be an array of values. With smart mode enabled, it will not force a single-value search param into an array.
- returns: <[object][object-mdn-url]> An object of decoded URL search params from a given string.

This method decodes/ parses a string value into an object.

### stringify(value)

- `value` <`unknown`> Any value of unknown type. It accepts any JavaScript primitives and objects.
- returns: <[string][string-mdn-url]> A string of encoded URL search params from a given input.

This method encodes/ stringifies an input into a string.

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

[version-badge]: https://flat.badgen.net/npm/v/tyqs?icon=npm
[mit-license-badge]: https://flat.badgen.net/npm/license/tyqs

[downloads-badge]: https://flat.badgen.net/npm/dm/tyqs
[total-downloads-badge]: https://flat.badgen.net/npm/dt/tyqs?label=total%20downloads
[packagephobia-badge]: https://flat.badgen.net/packagephobia/install/tyqs
[bundlephobia-badge]: https://flat.badgen.net/bundlephobia/minzip/tyqs

[ga-badge]: https://github.com/motss/tyqs/actions/workflows/ci.yml/badge.svg
[codecov-badge]: https://flat.badgen.net/codecov/c/github/motss/tyqs?label=codecov&icon=codecov

[coc-badge]: https://flat.badgen.net/badge/code%20of/conduct/pink

<!-- Links -->
[follow-me-url]: https://twitter.com/igarshmyb?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=motss/tyqs

[version-url]: https://www.npmjs.com/package/tyqs
[mit-license-url]: /LICENSE

[downloads-url]: http://www.npmtrends.com/tyqs
[packagephobia-url]: https://packagephobia.now.sh/result?p=tyqs
[bundlephobia-url]: https://bundlephobia.com/result?p=tyqs

[ga-url]: https://github.com/motss/tyqs/actions/workflows/ci.yml
[codecov-url]: https://codecov.io/gh/motss/tyqs

[coc-url]: /code-of-conduct.md
