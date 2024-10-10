import escape from './escape';

function code(content: string) {
    return ` \`${escape(content)}\` `;
}

export default code;
