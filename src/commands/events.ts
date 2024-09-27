import partialRight from 'lodash.partialright';
import { getTranslationFileName, ModuleInfo, renderMarkdown } from '../helper/index.js';
import locale from '../locale/index.js';
import { LanguageRecord, Languages } from '../shared/index.js';
import { type NodeError, to } from '../utils/index.js';
import commonWorkflow from './_internal/common-workflow.js';
import generateEventsTemplate from './_internal/generate-events-template.js';
import getNativeModuleSearch from './_internal/get-native-module-search.js';
import getNativeModules from './_internal/get-native-modules.js';
import getTranslateModules from './_internal/get-translate-modules.js';
import normalizeEventsData from './_internal/normalize-events-data.js';
import type { ModuleDataDictionary } from './_internal/normalize-module-data.js';
import translateEventsLangXml from './_internal/translate-events-lang-xml.js';

export interface EventsCommandOption {
    to?: string;
    keywords?: string;
    google?: boolean;
    openRouter?: string;
}

async function events({ to: target, keywords, google = false, openRouter }: EventsCommandOption) {
    let targetOption: LanguageRecord = {} as LanguageRecord;
    if (target) {
        targetOption = Languages.getLanguages([target.toLowerCase()])[0] as LanguageRecord;
        if (!targetOption) {
            console.log(locale.EINVAL_LANG_CODE_OR_NAME);
            return;
        }
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

    const eventsPath = `${module.path}\\Events`;
    const moduleDataPath = `${module.path}\\ModuleData`;
    const [generateError, dictionary] = await to<ModuleDataDictionary, NodeError>(
        commonWorkflow<ModuleDataDictionary>([
            normalizeEventsData,
            partialRight(generateEventsTemplate, moduleDataPath, eventsPath),
            targetOption ? partialRight(translateEventsLangXml, moduleDataPath, targetOption, google, openRouter) : undefined,
        ], eventsPath, {
            messages: [
                locale.SPIN_LOCALE_NORMALIZE_XML,
                locale.SPIN_GENERATE_NORMALIZE_XML,
                targetOption ? `${locale.SPIN_LOCALE_TRANSLATE_XML} > ${openRouter ? 'OpenRouter' : google ? 'Google' : 'Bing'}` : undefined,
            ],
            translateIndex: 2,
        }),
    );
    if (generateError || !dictionary) return;

    const title = `## ${locale.LABEL_MD_TRANSLATION_FILE}`;

    const fileKeys = [...dictionary.keys()];
    const fileRows = fileKeys.map((key) => {
        const count = Object.keys(dictionary.get(key) || {}).length;
        const targetPath = `\\${module.id}\\ModuleData\\${targetOption.code}\\${getTranslationFileName(
            key,
            targetOption.code,
        )}`;
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

export default events;
