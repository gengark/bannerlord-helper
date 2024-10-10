function codeBlock(contents: string, type = '') {
    return `\`\`\`${type}\n${contents}\n\`\`\`\n`;
}

export default codeBlock;
