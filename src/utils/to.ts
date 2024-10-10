/**
 * Converts a Promise to a tuple, returning either the result or the caught error object.
 *
 * @param {Promise<T>} promise The promise to convert.
 * @return {Promise<[U, undefined] | [undefined, T]>} A promise that resolves to a tuple containing the error or null and the result.
 * @see [await-to-js]{@link https://github.com/kabeep/await-to-js/blob/master/src/await-to-js.ts}
 * @example
 *
 * // Usage example:
 * const [error, data] = await to(fetch('/api/data'));
 */
async function to<T, U = Error>(promise: Promise<T>): Promise<[U, undefined] | [undefined, T]> {
    return promise
        .then<[undefined, T]>((data: T) => [undefined, data])
        .catch<[U, undefined]>((error: U) => {
            return [error, undefined];
        });
}

export default to;
