import escape from './escape';

function link(url: string, label?: string, title?: string) {
    if (label) {
        return ` [${escape(label)}](${[encodeURI(url), title].filter(Boolean).join(' ')}) `;
    }

    return ` <${url}> `;
}

export default link;
