import escape from './escape';

function bold(content: string) {
    return ` **${escape(content)}** `;
}

export default bold;
