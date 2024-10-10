/**
 * Checks if the given string contains a character specified by its code point.
 * @param {string} haystack - The string to search within.
 * @param {number} nch - The code point of the character to search for.
 * @returns {boolean} True if the character is found; otherwise, false.
 */
function containsChar(haystack: string, nch: number): boolean {
    let index = 0;
    while (index < haystack.length) {
        if (haystack.codePointAt(index++) === nch) {
            return true;
        }
    }

    return false;
}

/**
 * Performs a fuzzy search to determine if the `needle` string can be found
 * within the `haystack` string, allowing for non-consecutive matching of characters.
 *
 * @param {string} needle - The string to search for.
 * @param {string} haystack - The string to search within.
 * @return {boolean} Returns `true` if the `needle` can be found in the `haystack`,
 *                  allowing for characters to be non-consecutive; otherwise, `false`.
 * @see [fuzzysearch]{@link https://github.com/bevacqua/fuzzysearch/blob/master/index.js}
 * @example
 *
 * // => true
 * fuzzySearch('abc', 'aebdc');
 *
 * // => false
 * fuzzySearch('abc', 'acbd');
 */
function fuzzySearch(needle: string, haystack: string): boolean {
    const haystackLength = haystack.length;
    const needleLength = needle.length;

    if (needleLength > haystackLength) {
        return false;
    }

    if (needleLength === haystackLength) {
        return needle === haystack;
    }

    for (let i = 0; i < needleLength; i++) {
        const nch = needle.codePointAt(i)!;

        if (!containsChar(haystack, nch)) {
            return false;
        }
    }

    return true;
}

export default fuzzySearch;
