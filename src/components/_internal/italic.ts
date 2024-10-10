import escape from './escape';

function italic(content: string) {
    return ` *${escape(content)}* `;
}

export default italic;
