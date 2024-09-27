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

    outer: for (let i = 0, index = 0; i < needleLength; i++) {
        const nch = needle.charCodeAt(i);

        while (index < haystackLength) {
            if (haystack.charCodeAt(index++) === nch) {
                continue outer;
            }
        }

        return false;
    }

    return true;
}

export default fuzzySearch;
