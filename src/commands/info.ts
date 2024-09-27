import process from 'node:process';
import partialRight from 'lodash.partialright';
import ora from 'ora';
import { translateApi } from '../api/index.js';
import { type ModuleInfo, type RemoteModuleOption } from '../helper/index.js';
import readRemoteModule from '../helper/read-remote-module.js';
import locale from '../locale/index.js';
import { type NodeError, type Noop, to } from '../utils/index.js';
import commonWorkflow from './_internal/common-workflow.js';
import getNativeModuleSearch from './_internal/get-native-module-search.js';
import getNativeModules from './_internal/get-native-modules.js';
import getRemoteModulePreview from './_internal/get-remote-module-preview.js';
import getTranslateModules from './_internal/get-translate-modules.js';
import getUpdatedModuleConfig, { type CompositeModuleConfig } from './_internal/get-updated-module-config.js';

export interface InfoCommandOption {
    keywords?: string;
    google?: boolean;
    reset?: boolean;
}

async function info({ keywords, google, reset }: InfoCommandOption) {
    const spinner = ora({ color: 'cyan' });

    const messages = [
        locale.SPIN_NATIVE_MOD_SEARCH,
        `${locale.SPIN_MODULE_NAME_TRANSLATE} > ${google ? 'Google' : 'Bing'}`,
        undefined,
        undefined,
        undefined,
        locale.SPIN_READ_PAGE,
    ];
    const pipeline: Noop[] = [
        getNativeModules,
        partialRight(getTranslateModules<ModuleInfo>, google),
        getNativeModuleSearch,
        (module: ModuleInfo) => {
            spinner.info(`${locale.SPIN_NEXUSMOD_SEARCH}...`);
            return module;
        },
        partialRight(getUpdatedModuleConfig, google, reset),
        readRemoteModule<CompositeModuleConfig>,
    ];

    const [error, option] = await to<RemoteModuleOption<CompositeModuleConfig>, NodeError>(
        commonWorkflow<RemoteModuleOption<CompositeModuleConfig>>(pipeline, keywords, { messages, translateIndex: 1 }),
    );

    if (error || !option) process.exit(0);

    if (option.isAdult) {
        spinner.warn(locale.WARN_NOT_SAFE_FOR_WORK);
        return;
    }

    if (
        option.createdBy &&
        option.uploadedBy &&
        option.author?.name &&
        ![option.createdBy, option.uploadedBy].includes(option.author.name)
    ) {
        spinner.warn(locale.WARN_NOT_SAME_MODULE);
    }

    spinner.start(locale.SPIN_MODULE_DESC_TRANSLATE);
    const timer = setTimeout(() => {
        spinner.text = locale.WARN_GOOGLE_TRANSLATE;
        spinner.color = 'yellow';
        clearTimeout(timer);
    }, 8000);
    const translation = await translateApi.messages([option.title, option.description], { google });
    clearTimeout(timer);
    spinner.succeed(locale.SPIN_MODULE_DESC_TRANSLATE);

    const md = await getRemoteModulePreview(option, translation);

    console.log('\n', md);
}

export default info;
