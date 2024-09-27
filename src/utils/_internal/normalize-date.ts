/**
 * Checks if the given input is a valid timestamp (10 or 13 digits).
 *
 * @param input - The input to be checked, can be a Date object, number, or string.
 * @returns True if the input is a valid 10 or 13 digit timestamp, false otherwise.
 */
const isValidTimestamp = (input: Date | number | string): boolean => {
    return /^\d{10,13}$/.test(input.toString());
};

/**
 * Normalizes the input into a Date object. If the input is a valid timestamp
 * (either 10 or 13 digits), it will pad or interpret it correctly. Otherwise, it
 * attempts to create a Date object directly from the input.
 *
 * @param input - The input value, which can be a Date object, number, or string.
 * @returns A Date object parsed from the input.
 */
function normalizeDate(input: Date | number | string): Date {
    if (isValidTimestamp(input)) {
        const timestamp = Number(input.toString().padEnd(13, '0')); // Pad to 13 digits if necessary
        return new Date(timestamp);
    }

    return new Date(input); // Fall back to interpreting the input directly
}

export default normalizeDate;
