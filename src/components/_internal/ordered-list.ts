import escape from './escape';

function orderedList(contents: string[]) {
    return Array.from({ length: contents.length }, (_, index: number) => {
        return `${index + 1}. ${escape(contents[index])}`;
    }).join('\n');
}

export default orderedList;
