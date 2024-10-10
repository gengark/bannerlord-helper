import escape from './escape';

function unorderedList(contents: string[]) {
    const sign = '-';

    return contents
        .map((item) => {
            return `${sign} ${escape(item).replace(/^(\d+)(\.)/, (_, numeric: string, dot: string) => {
                return `${numeric}\\${dot}`;
            })}`;
        })
        .join('\n');
}

export default unorderedList;
