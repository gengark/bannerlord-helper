import { openRouterApi } from '../../api/index.js';

async function rewriteModuleMarkdown(markdown: { header: string; content: string }, key: string) {
    const prompt =
        'Please organize this module introduction of the Mount & Blade II: Bannerlord game into a Markdown document:';
    const message = `${prompt}\n${markdown.content}`;
    const content = await openRouterApi.locale(key, 'qwen/qwen-2-vl-7b-instruct:free', message);

    return `${markdown.header}\n\n${content}`;
}

export default rewriteModuleMarkdown;
