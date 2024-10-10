import escape from './escape';

function heading(content: string, level: number) {
    const sign = '#';
    const signs = sign.repeat(level);

    return `${signs} ${escape(content)}\n`;
}

export default heading;
