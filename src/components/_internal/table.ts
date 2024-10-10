type TableAlignment = 'left' | 'center' | 'right';

function formatting(content: string) {
    return content.replaceAll('|', '&#124;');
}

function wrap(content: string) {
    return `| ${content} |\n`;
}

function row(contents: Array<string | number | undefined>) {
    return wrap(contents.map((content) => (content === undefined ? '' : formatting(content.toString()))).join(' | '));
}

function separate(alignments: TableAlignment[], columnCount: number) {
    const content = Array.from({ length: columnCount }).map((_, index) => {
        switch (alignments[index]) {
            case 'center': {
                return ':---:';
            }

            case 'right': {
                return '---:';
            }

            default: {
                return '---';
            }
        }
    });
    return wrap(content.join(' | '));
}

function table(
    header: Array<string | number | undefined>,
    body: Array<Array<string | number | undefined>>,
    alignments?: TableAlignment[],
) {
    const th = row(header);
    const separator = separate(alignments ?? [], header.length);

    let td = '';
    for (const item of body) {
        td += row(item);
    }

    return `${th}${separator}${td}\n`;
}

export default table;
