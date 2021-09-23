export type CamelCaseToSnakeCase<S extends string> = S extends `${infer T}${infer U}`
    ? `${T extends Capitalize<T> ? '_' : ''}${Lowercase<T>}${CamelCaseToSnakeCase<U>}`
    : S;

export type SnakeCaseObject<T extends {}> = {
    [K in keyof T as K extends string ? CamelCaseToSnakeCase<K> : K]: T[K];
};

export type SnakeCaseNestedObject<T> = T extends object
    ? {
          [K in keyof T as K extends string ? CamelCaseToSnakeCase<K> : K]: SnakeCaseNestedObject<T[K]>;
      }
    : T;
