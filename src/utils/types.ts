/**
 * A type that can be either a single value or an array of values.
 */
export type Arrayable<T> = T | T[];

/**
 * A type that can be either a Promise or a direct value.
 */
export type Awaitable<T> = Promise<T> | T;

/**
 * Converts a type with readonly properties to a mutable type.
 */
export type Mutable<T> = { -readonly [P in keyof T]: T[P] };

/**
 * Casts the given value to a mutable type.
 * @param {readonly any[]} value - The value to convert to a mutable type.
 * @returns The mutable version of the input value.
 */
export const mutable = <T extends readonly any[] | Record<string, unknown>>(value: T): Mutable<T> => {
    return value as Mutable<T>;
};

/**
 * A type that can be either a value or null.
 */
export type Nullable<T> = T | undefined;

/**
 * A function type that takes any number of arguments and returns any value.
 */
export type Noop = (...arguments_: any[]) => any;

/**
 * A no-operation function that does nothing.
 * @param {any[]} arguments_ - Any arguments (ignored).
 */
// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop: Noop = (...arguments_: any[]): any => {};

/**
 * Creates a tuple from the given arguments.
 * @param {string[]} arguments_ - The string arguments to create a tuple.
 * @returns An array of the provided arguments.
 */
export const tuple = <T extends string[]>(...arguments_: T): T => arguments_;
