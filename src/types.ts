declare const Brand: unique symbol;

export type Branded<T, Brand extends string> = T & {
  [Brand]: Brand;
};

export interface ParseOptions {
  replacer?<T>(value: string): T;
  singles?: string[];
  smart?: boolean;
}

export interface StringifyOptions {
  replacer?<T>(init: StringifyReplacerInit<T>): string | null | undefined;
}

interface StringifyReplacerInit<T> {
  flattenedKey: string;
  key: string;
  rawValue: T;
  value: string;
}

export type WithStringify<T> = T & {
  toJSON?(): string;
  toString?(): string;
};
