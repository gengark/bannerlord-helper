import NodeError from './node-error.js';

/**
 * Asserts that the condition is true. If not, it throws a `NodeError` with the provided message and code.
 *
 * @template T - The type of the condition to assert.
 * @param {*} condition - The condition to check. If this evaluates to `false`, an error will be thrown.
 * @param {string | (() => string)} [message] - Optional message or a function that returns a message to be included in the thrown error.
 * @param {string} code - Optional error code to be used in the thrown error. Default is 'EUNKNOWN'.
 * @throws {NodeError} Throws an `Error` if the condition is `false`.
 * @returns {void}
 * @see [tiny-invariant]{@link https://github.com/alexreardon/tiny-invariant/blob/master/src/tiny-invariant.ts}
 * @example
 *
 * // Example: Throwing an error when the condition is false
 * ensure(false, 'Something went wrong');
 */
function ensure(condition: any, message?: string | (() => string), code?: string): asserts condition {
    if (condition) {
        return;
    }

    const providedMessage = typeof message === 'function' ? message() : message;
    throw new NodeError(providedMessage ?? 'Unknown error', code);
}

export default ensure;
