import partialRight from 'lodash.partialright';
import { getTranslationFileName, type ModuleInfo, renderMarkdown } from '../helper/index.js';
import locale from '../locale/index.js';
import { Languages } from '../shared/index.js';
import { type NodeError, to } from '../utils/index.js';
import commonWorkflow from './_internal/common-workflow.js';
import getNativeModuleSearch from './_internal/get-native-module-search.js';
import getNativeModules from './_internal/get-native-modules.js';
import getTranslateModules from './_internal/get-translate-modules.js';
import normalizeModuleData, { type ModuleDataDictionary } from './_internal/normalize-module-data.js';
import translateModuleData from './_internal/translate-module-data.js';

export interface LocalizeCommandOption {
    to: string;
    keywords?: string;
    prefix?: string;
    google?: boolean;
}

async function localize({ to: target, keywords, prefix = '', google }: LocalizeCommandOption) {
    const [targetOption] = Languages.getLanguages([target.toLowerCase()]);
    if (!targetOption) {
        console.log(locale.EINVAL_LANG_CODE_OR_NAME);
        return;
    }

    const [selectError, module] = await to<ModuleInfo>(
        commonWorkflow<ModuleInfo>(
            [getNativeModules, partialRight(getTranslateModules<ModuleInfo>, google), getNativeModuleSearch],
            keywords,
            {
                messages: [
                    locale.SPIN_NATIVE_MOD_SEARCH,
                    `${locale.SPIN_MODULE_NAME_TRANSLATE} > ${google ? 'Google' : 'Bing'}`,
                ],
                translateIndex: 1,
            },
        ),
    );

    if (selectError || !module) return;

    const moduleDataPath = `${module.path}\\ModuleData`;
    const [translateError, dictionary] = await to<ModuleDataDictionary, NodeError>(
        commonWorkflow<ModuleDataDictionary>(
            [
                partialRight(normalizeModuleData, targetOption),
                partialRight(translateModuleData, moduleDataPath, targetOption, prefix, google),
            ],
            moduleDataPath,
            {
                messages: [locale.SPIN_LOCALE_NORMALIZE_XML, locale.SPIN_LOCALE_TRANSLATE_XML],
                translateIndex: 1,
            },
        ),
    );

    if (translateError || !dictionary) return;

    const title = `## ${locale.LABEL_MD_TRANSLATION_FILE}`;

    const fileKeys = [...dictionary.keys()];
    const fileRows = fileKeys.map((key) => {
        const count = Object.keys(dictionary.get(key) || {}).length;
        const targetPath = `\\${module.id}\\ModuleData\\${targetOption.code}\\${getTranslationFileName(key, targetOption.code)}`;
        return `| \`${key}\` | ${count} | ${targetPath} |`;
    });

    const tableHeader = `|${locale.LABEL_MD_FILE}|${locale.LABEL_MD_ROW}|${locale.LABEL_MD_PATH}|`;
    const tableSeparator = '| - | - | - |';
    const tableBodyFixed = '| | | |';

    const md = await renderMarkdown(
        `${title}\n\n${tableHeader}\n${tableSeparator}\n${tableBodyFixed}\n${fileRows.join('\n')}`,
    );
    console.log(md);
}

export default localize;
