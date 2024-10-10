/**
 * Attempts to invoke `fn`, returning either the result or the caught error
 * object. Any additional arguments are provided to `fn` when it's invoked.
 *
 * @param {(...args: V) => T} function_ The function to attempt.
 * @param {V} arguments_ The arguments to invoke `fn` with.
 * @returns {[U, undefined] | [undefined, T]} Returns an array with the error or null and the result.
 * @see [lodash]{@link https://github.com/lodash/lodash/blob/main/src/attempt.ts}
 * @see [try-catch]{@link https://github.com/coderaiser/try-catch/blob/master/lib/try-catch.js}
 * @example
 *
 * // Safely execute a function and handle potential errors.
 * const [error, result] = op(() => JSON.parse('{"invalid":}'));
 */
function op<T, V extends any[] = any[], U extends Error = Error>(
    function_: (...arguments_: V) => T,
    ...arguments_: V
): [U, undefined] | [undefined, T] {
    try {
        return [undefined, function_(...arguments_)] as [undefined, T];
    } catch (error: unknown) {
        return [error, undefined] as [U, undefined];
    }
}

export default op;
