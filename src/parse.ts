import type { ParseOptions } from './types.js';

export function parse<T extends object>(searchParams: string | URLSearchParams, opt?: ParseOptions): T {
  const params = new URLSearchParams(
    [...new URLSearchParams(searchParams)].map((
      [k, v]) =>
      [
        k.replace(/([[\]])/g, (_, s) => s === '[' ? '.' : ''),
        v,
      ]
    )
  );
  const { singles, smart } = opt || {};
  const iss = new Set(singles);
  const ism = smart ?? true;
  const t = {} as Record<string, unknown>;

  [...new Set(params.keys())].forEach((key) => {
    let k = key;
    const isSingleSet = iss.has(key);
    const lv = (
      isSingleSet ?
        params.get(key) as string :
        params.getAll(key).join(',')
    ).split(',').map(n => decodeURIComponent(n.replace(/\+/g, ' ')));
    // single,l=1,smart=1 -> str
    // single,l=1,smart=0 -> str
    // single,l=2,smart=1 -> arr
    // single,l=2,smart=0 -> arr
    // multi,l=1,smart=1 -> str
    // multi,l=1,smart=0 -> arr
    // multi,l=2,smart=1 -> arr
    // multi,l=2,smart=0 -> arr
    let v: unknown = lv.length === 1 && (ism || isSingleSet) ? lv[0] : lv;

    if (k.includes('.')) {
      const [f, ...kl] = k.split('.');
      const o = t[f] || {};
      const l = kl.pop() as string;

      (
        /* eslint-disable @typescript-eslint/no-explicit-any */
        kl.reduce(
          (p, n) => ((p as any)[n] ||= {} as Record<string, never>),
          o
        ) as Record<string, unknown>
        /* eslint-enable @typescript-eslint/no-explicit-any */
      )[l] = v;

      k = f;
      v = o;
    }

    t[k] = v;
  });

  return t as T;
}

// FIXME: Add optional replacerFn
