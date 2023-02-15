import type { Branded, WithStringify } from './types.js';

type BrandedObjectWithParent = WithStringify<Branded<Record<string, string | number | boolean>, '$$parent'>>;

export function stringify(value: unknown): string {
  if (!value) return '';

  const stack = [value];
  const sp = new URLSearchParams();

  while (stack.length) {
    const item = stack.pop() as Record<string, BrandedObjectWithParent>;

    Object.entries(item).forEach(([k, v]) => {
      if (k === '$$parent') return;

      const typeOfValue = typeof(v);
      const k1 = item.$$parent ? `${item.$$parent}.${k}` : k;

      if (v != null && typeOfValue === 'object' && !Array.isArray(v)) {
        v.$$parent = k1;
        stack.push(v);
      } else {
        let v1 = typeOfValue === 'string' ? v : '';

        if (Array.isArray(v)) v1 = v.join(',');
        else if (v?.toJSON) v1 = v.toJSON();
        else if (v?.toString) v1 = v.toString();
        else v1 = String(v);

        sp.append(k1, v1);
      }
    });
  }

  sp.sort();

  return sp.toString();
}

// FIXME: Add optional replacerFn
