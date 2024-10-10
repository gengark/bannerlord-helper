import chalk from 'chalk';
import { Marked } from 'marked';
import { markedTerminal } from 'marked-terminal';
import type { Awaitable } from '../../utils';

const md = new Marked(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    markedTerminal({
        heading: chalk.magenta,
        table: chalk.yellow,
    }) as any,
);

function createRender<T extends any[]>(function_: (...arguments_: T) => Awaitable<string>) {
    return async (...arguments_: T): Promise<string> => {
        return md.parse(await function_(...arguments_));
    };
}

export default createRender;
