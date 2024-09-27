import partialRight from 'lodash.partialright';
import { type NexusModsOption } from '../api/index.js';
import { browserRemotePage, renderMarkdown } from '../helper/index.js';
import locale from '../locale/index.js';
import { type NodeError, type Noop, to } from '../utils/index.js';
import commonWorkflow from './_internal/common-workflow.js';
import getRemoteModuleMarkdown from './_internal/get-remote-module-markdown.js';
import getRemoteModuleSelected from './_internal/get-remote-module-selected.js';
import getRemoteModules from './_internal/get-remote-modules.js';
import getTranslateModules from './_internal/get-translate-modules.js';
import rewriteModuleMarkdown from './_internal/rewrite-module-markdown.js';
import translateModuleMarkdown from './_internal/translate-module-markdown.js';

export interface SearchCommandOption {
    query: string;
    openRouter?: string;
    open?: boolean;
    google?: boolean;
}

async function search({ query, openRouter, open: isOpen, google }: SearchCommandOption) {
    const suffix = ` > ${google ? 'Google' : 'Bing'}`;
    const messages = [locale.SPIN_NEXUSMOD_SEARCH, `${locale.SPIN_MODULE_NAME_TRANSLATE}${suffix}`, undefined];
    const pipeline: Noop[] = [
        getRemoteModules,
        partialRight(getTranslateModules<NexusModsOption>, google),
        getRemoteModuleSelected,
    ];
    const translateIndex = [1];

    if (isOpen) {
        messages.push(locale.SPIN_BROWSE_PAGE);
        pipeline.push(browserRemotePage);
    } else {
        messages.push(locale.SPIN_READ_PAGE);
        pipeline.push(getRemoteModuleMarkdown);
        if (openRouter) {
            messages.push(`${locale.SPIN_MODULE_PAGE_AI} > OpenRouter`);
            pipeline.push(partialRight(rewriteModuleMarkdown, openRouter));
        } else {
            messages.push(`${locale.SPIN_MODULE_PAGE_TRANSLATE} ${suffix}`);
            pipeline.push(partialRight(translateModuleMarkdown, google));
            translateIndex.push(4);
        }

        messages.push(locale.SPIN_RENDER_PAGE);
        pipeline.push(renderMarkdown);
    }

    const [error, content] = await to<string | undefined, NodeError>(
        commonWorkflow<string>(pipeline, query, { messages, translateIndex }),
    );

    if (error || !content) return;

    console.log('\n', content);
}

export default search;
