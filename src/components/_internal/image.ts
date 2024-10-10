import escape from './escape';

function image(source: string, label?: string, url?: string, title?: string) {
    const imageLabel = label ? escape(label) : 'Image';
    const imageSource = `(${[encodeURI(source), title].filter(Boolean).join(' ')})`;

    if (url) {
        return `[![${imageLabel}]${imageSource}](${encodeURI(url)})\n`;
    }

    return `![${imageLabel}]${imageSource}\n`;
}

export default image;
