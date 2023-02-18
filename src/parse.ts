import type { ParseOptions } from './types.js';

export function parse<T extends object>(
  searchParams: string | URLSearchParams,
  replacer?: ParseOptions['replacer']
): T {
  const params = new URLSearchParams(
    [...new URLSearchParams(searchParams)].map((
      [k, v]) =>
      [
        k.replace(/([[\]])/g, (_, s) => s === '[' ? '.' : ''),
        v,
      ]
    )
  );
  const t = {} as Record<string, unknown>;

  new Set(params.keys()).forEach((paramKey) => {
    const rawValue =
      params
        .getAll(paramKey)
        .join(',')
        .split(',')
        .map(n =>
          decodeURIComponent(n.replace(/\+/g, ' '))
        );
    const value = rawValue.length === 1 ? rawValue[0] : rawValue;

    let key = paramKey;
    let v = replacer ?
      replacer({
        firstRawValue: (params.get(paramKey) as string).split(','),
        key,
        rawValue,
        value,
      }) :
      value;

    if (key.includes('.')) {
      const [f, ...kl] = key.split('.');
      const o = (t[f] || {}) as Record<string, unknown>;
      const l = kl.pop() as string;

      (
        kl.reduce(
          (p, n) =>
            (p[n] ??= {}) as Record<string, unknown>,
          o
        )
      )[l] = v;

      key = f;
      v = o;
    }

    t[key] = v;
  });

  return t as T;
}
