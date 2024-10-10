import type { CompareOperator } from 'compare-versions';

/**
 * Checks if the given date is valid.
 * @param {Date | number | string} date - The date to validate.
 * @returns True if the date is valid; otherwise, false.
 * @example
 *
 * // => true
 * isValidDate('1970-01-01');
 *
 * // => true
 * isValidDate(1704067200000);
 *
 * // => false
 * isValidDate('beep--')
 */
export function isValidDate(date: Date | number | string): boolean {
    return !Number.isNaN(Number(date));
}

/**
 * Checks if the given input is a valid timestamp (10 or 13 digits).
 * @param {Date | number | string} input - The input to be checked, can be a Date object, number, or string.
 * @returns True if the input is a valid 10 or 13 digit timestamp, false otherwise.
 * @example
 *
 * // => true
 * isValidTimestamp(1704067200);
 *
 * // => true
 * isValidTimestamp(1704067200000);
 *
 * // => false
 * isValidTimestamp(17040672);
 */
export function isValidTimestamp(input: Date | number | string): boolean {
    return /^\d{10,13}$/.test(input.toString());
}

/**
 * Normalizes the input into a Date object. If the input is a valid timestamp
 * (either 10 or 13 digits), it will pad or interpret it correctly. Otherwise, it
 * attempts to create a Date object directly from the input.
 * @param {Date | number | string} input - The input value, which can be a Date object, number, or string.
 * @returns A Date object parsed from the input.
 * @example
 *
 * // => Mon, 01 Jan 1970 00:00:00 GMT
 * normalizeDate(new Date('1970-01-01'));
 *
 * // => Mon, 01 Jan 1970 00:00:00 GMT
 * normalizeDate(1704067200);
 *
 * // => Mon, 01 Jan 1970 00:00:00 GMT
 * normalizeDate('1970-01-01');
 */
export function normalizeDate(input: Date | number | string): Date {
    if (isValidTimestamp(input)) {
        const timestamp = Number(input.toString().padEnd(13, '0'));
        return new Date(timestamp);
    }

    return new Date(input);
}

/**
 * Compares two dates using the specified comparison operator.
 * @param {Date | number | string} input - The first date input (can be a Date, number, or string).
 * @param {Date | number | string} otherInput - The second date input (can be a Date, number, or string).
 * @param {CompareOperator} operator - The comparison operator to use.
 * @returns True if the comparison holds; otherwise, false.
 * @example
 *
 * // => true
 * compareDate(new Date(), new Date('1970-01-01'), '>=');
 *
 * // => true
 * compareDate('1970-01-01', '1970-01-01', '=');
 *
 * // => false
 * compareDate(1727568000000, 1727568000000, '!=');
 */
export function compareDate(
    input: Date | number | string,
    otherInput: Date | number | string,
    operator: CompareOperator,
): boolean {
    const date: Date = normalizeDate(input);
    const otherDate: Date = normalizeDate(otherInput);

    if (!isValidDate(date) || !isValidDate(otherDate)) {
        return false;
    }

    const timestamp = Number(date);
    const otherTimestamp = Number(otherDate);

    if (operator === '!=') {
        return timestamp !== otherTimestamp;
    }

    let sign: number;
    if (timestamp > otherTimestamp) {
        sign = 1;
    } else if (timestamp < otherTimestamp) {
        sign = -1;
    } else {
        sign = 0;
    }

    switch (sign) {
        case 1: {
            return ['>', '>='].includes(operator);
        }

        case -1: {
            return ['<', '<='].includes(operator);
        }

        default: {
            return ['=', '>=', '<='].includes(operator);
        }
    }
}

/**
 * Formats a date object or timestamp into a specified string format.
 * @param input - A Date object, timestamp (10 or 13 digits), or date string.
 * @param format - The format string, default is 'YYYY-MM-DD HH:mm:ss'.
 * @returns The formatted date string or 'Invalid Date' if input is invalid.
 * @example
 *
 * // => '2021-10-01 00:00:00'
 * formatDate(1633035600000);
 *
 * // => '2021/10/01 00:00:00'
 * formatDate('2021-10-01T00:00:00Z', 'YYYY/MM/DD HH:mm:ss');
 *
 * // => 'Invalid Date'
 * formatDate('invalid date');
 */
export function formatDate(input: Date | number | string, format = 'YYYY-MM-DD HH:mm:ss'): string {
    const date = normalizeDate(input);
    const padStart = (number_: number, size = 2): string => String(number_).padStart(size, '0');

    if (Number.isNaN(Number(date))) {
        return 'Invalid Date';
    }

    /* eslint-disable @typescript-eslint/naming-convention */
    const map: Record<string, string | number> = {
        YYYY: padStart(date.getFullYear(), 4),
        MM: padStart(date.getMonth() + 1),
        DD: padStart(date.getDate()),
        HH: padStart(date.getHours()),
        mm: padStart(date.getMinutes()),
        ss: padStart(date.getSeconds()),
        SSS: padStart(date.getMilliseconds(), 3),
        Z: (() => {
            const offset = -date.getTimezoneOffset();
            const sign = offset >= 0 ? '+' : '-';
            const hours = padStart(Math.floor(Math.abs(offset) / 60));
            const minutes = padStart(Math.abs(offset) % 60);
            return `${sign}${hours}:${minutes}`;
        })(),
    };
    /* eslint-enable @typescript-eslint/naming-convention */

    return format.replace(/YYYY|MM|DD|HH|mm|ss|SSS|Z/g, (match) => map[match] as string);
}

export { type CompareOperator } from 'compare-versions';
