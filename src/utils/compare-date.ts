import normalizeDate from './_internal/normalize-date.js';
import validDate from './_internal/valid-date.js';

/**
 * Compares two date-like inputs and checks if the first one is greater than the second.
 *
 * @param input - The first date input to compare, can be a Date object, number (timestamp), or string.
 * @param otherInput - The second date input to compare, can also be a Date object, number (timestamp), or string.
 * @returns True if the first date is valid and greater than the second date, otherwise false.
 */
function compareDate(input: Date | number | string, otherInput: Date | number | string): boolean {
    const date: Date = normalizeDate(input);
    const otherDate: Date = normalizeDate(otherInput);

    // Check if both dates are valid and if the first date is greater than the second
    return validDate(date) && validDate(otherDate) && Number(date) > Number(otherDate);
}

export default compareDate;
