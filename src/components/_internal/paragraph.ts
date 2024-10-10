import escape from './escape';

function paragraph(content: string) {
    return `${escape(content)}\n`;
}

export default paragraph;
