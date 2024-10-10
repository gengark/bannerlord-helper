function blockquote(content: string, level = 1) {
    const sign = '>';
    const signs = sign.repeat(level);

    return `${signs} ${content}\n`;
}

export default blockquote;
