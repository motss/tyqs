import type { Branded, StringifyOptions, WithStringify } from './types.js';

type BrandedObjectWithParent = WithStringify<Branded<Record<string, string | number | boolean>, '$$parent'>>;

export function stringify(
  input: unknown,
  replacer?: StringifyOptions['replacer']
): string {
  if (!input) return '';

  const stack = [['', input]];
  const sp = new URLSearchParams();

  while (stack.length) {
    const [itemKey, itemValue] = stack.pop() as [string, Record<string, BrandedObjectWithParent>];

    Object.entries(itemValue).forEach(([key, rawValue]) => {
      if (rawValue == null && replacer == null) return;

      const typeOfValue = typeof(rawValue);
      const flattenedKey = itemKey ? `${itemKey}.${key}` : key;

      if (rawValue !== null && typeOfValue === 'object' && !Array.isArray(rawValue)) {
        stack.push([flattenedKey, rawValue]);
      } else {
        let value = typeOfValue === 'string' ? rawValue : '';

        if (Array.isArray(rawValue)) value = rawValue.join(',');
        else if (rawValue?.toJSON) value = rawValue.toJSON();
        else if (rawValue?.toString) value = rawValue.toString();
        else value = String(rawValue);

        const vv = replacer ?
          replacer({ flattenedKey, key, rawValue, value }) :
          value;

        vv != null && sp.append(flattenedKey, vv);
      }
    });
  }

  sp.sort();

  return sp.toString();
}
