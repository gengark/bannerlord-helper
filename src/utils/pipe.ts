type SyncFunction = (...arguments_: any[]) => any;

/**
 * Composes a series of synchronous functions from left to right.
 * @param {SyncFunction[]} fns - A list of functions to be composed.
 * @see [lodash]{@link https://github.com/lodash/lodash/blob/main/src/flow.ts}
 * @returns A function that executes the composed functions with the provided arguments.
 * @example
 *
 * const add = (a: number, b: number) => a + b;
 * const square = (n: number) => n * n;
 * const addSquare = pipe(add, square);
 * // => 9
 * addSquare(1, 2);
 */
function pipe(...fns: SyncFunction[]) {
    const { length } = fns;

    // Validate function types
    let i = length;
    while (i--) {
        if (typeof fns[i] !== 'function') {
            throw new TypeError('Expected a function');
        }
    }

    return function (this: any, ...arguments_: any[]) {
        let index = 0;
        let result = length ? fns[index].apply(this, arguments_) : arguments_[0];

        while (++index < length) {
            result = fns[index].call(this, result);
        }

        return result;
    };
}

export default pipe;
