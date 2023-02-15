declare const Brand: unique symbol;

export type Branded<T, Brand extends string> = T & {
  [Brand]: Brand;
};

export interface ParseOptions {
  singles?: string[];
  smart?: boolean;
}

export type WithStringify<T> = T & {
  toJSON?(): string;
  toString?(): string;
};
