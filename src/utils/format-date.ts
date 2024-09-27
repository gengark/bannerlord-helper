import normalizeDate from './_internal/normalize-date.js';

const padStart = (number_: number, size = 2): string => String(number_).padStart(size, '0');

/**
 * Formats a date object or timestamp into a specified string format.
 * @param input - A Date object, timestamp (10 or 13 digits), or date string.
 * @param format - The format string, default is 'YYYY-MM-DD HH:mm:ss'.
 * @returns The formatted date string or 'Invalid Date' if input is invalid.
 * @example
 * const date1 = formatDate(1633035600000); // '2021-10-01 00:00:00'
 * const date2 = formatDate('2021-10-01T00:00:00Z', 'YYYY/MM/DD HH:mm:ss'); // '2021/10/01 00:00:00'
 * const date3 = formatDate('invalid date'); // 'Invalid Date'
 */
function formatDate(input: Date | number | string, format = 'YYYY-MM-DD HH:mm:ss'): string {
    const date = normalizeDate(input);

    if (Number.isNaN(Number(date))) {
        return 'Invalid Date';
    }

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

    return format.replace(/YYYY|MM|DD|HH|mm|ss|SSS|Z/g, (match) => map[match] as string);
}

export default formatDate;
