import escape from './escape';

function emphasis(content: string) {
    return ` ***${escape(content)}*** `;
}

export default emphasis;
