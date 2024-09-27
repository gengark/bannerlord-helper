import chalk from 'chalk';
import { Marked } from 'marked';
import { markedTerminal } from 'marked-terminal';

const md = new Marked(
    markedTerminal({
        heading: chalk.magenta,
        table: chalk.yellow,
    }) as any,
);

async function renderMarkdown(markdown: string) {
    return md.parse(markdown);
}

export default renderMarkdown;
