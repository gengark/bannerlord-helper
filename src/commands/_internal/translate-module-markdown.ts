import { translateApi } from '../../api/index.js';
import { to } from '../../utils/index.js';

async function translateModuleMarkdown(markdown: { header: string; content: string }, google = false) {
    const [error, translation] = await to(translateApi.flexible(markdown.content, { google }));

    const content = error || !translation ? markdown.content : translation;
    return `${markdown.header}\n\n${content}`;
}

export default translateModuleMarkdown;
