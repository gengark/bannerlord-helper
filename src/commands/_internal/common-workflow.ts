import process from 'node:process';
import get from 'lodash.get';
import ora from 'ora';
import locale from '../../locale/index.js';
import { type NodeError, to, workflow, type WorkflowHookOption } from '../../utils/index.js';
import { type Noop } from '../../utils/noop.js';

export interface CommonWorkflowOption {
    messages: Array<string | undefined>;
    translateIndex?: number | number[];
}

async function commonWorkflow<T>(
    fns: Array<Noop | undefined>,
    parameters: any,
    { messages, translateIndex }: CommonWorkflowOption,
) {
    const spinner = ora({ color: 'cyan' });

    if (!Array.isArray(translateIndex)) {
        translateIndex = typeof translateIndex === 'number' ? [translateIndex] : [];
    }

    let timer: NodeJS.Timeout | undefined;
    const before = ({ index }: WorkflowHookOption) => {
        if (messages[index]) {
            spinner.start(messages[index]);
        } else {
            spinner.stop();
        }

        if (translateIndex.includes(index)) {
            timer = setTimeout(() => {
                spinner.text = locale.WARN_GOOGLE_TRANSLATE;
                spinner.color = 'yellow';
            }, 8000);
        }
    };

    const after = () => {
        spinner.stop();

        if (timer) {
            spinner.color = 'cyan';
            clearTimeout(timer);
            timer = undefined;
        }
    };

    const task = workflow<T>(
        fns.filter((item) => typeof item === 'function'),
        { before, after },
    );

    const [error, module] = await to<T, NodeError>(task(parameters));
    if (error) {
        if (timer) {
            clearTimeout(timer);
            timer = undefined;
        }

        const { code = 'ERROR_BLACK_HOLE', message = 'UNKNOWN ERROR' } = error;
        spinner.fail(get(locale, code, message));
        console.log(`ERROR MESSAGE: ${error.message}`);

        // If (process.env.NODE_ENV !== 'production') {
        //     console.log(error.stack);
        // }

        throw error;
    } else {
        return module;
    }
}

export default commonWorkflow;
