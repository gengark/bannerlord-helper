function escape(content: string) {
    // Return content.replace(/[\\`*_{}[\]<>()#+\-.!|]/g, (matching: string) => `${matching}`);
    return content;
}

export default escape;
