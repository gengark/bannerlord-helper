import fs from 'node:fs';
import get from 'lodash.get';
import { translationDataXml } from '../../helper/index.js';
import { ErrorCodes, type LanguageRecord } from '../../shared/index.js';
import { ensure, isObject, type NodeError, run } from '../../utils/index.js';
import type { ModuleDataDictionary } from './normalize-module-data.js';
import writeLanguageDataXml from './write-language-data-xml.js';

// ModItem { id: { name, key } }
type ModuleDataItemOption = Record<
    string,
    {
        name: string;
        key: string;
    }
>;

function normalizeLanguageData(
    moduleDataPath: string,
    sourceLanguage: LanguageRecord,
    targetLanguage: LanguageRecord,
): ModuleDataDictionary {
    const [accessError] = run<void, NodeError>(fs.accessSync, moduleDataPath, fs.constants.R_OK | fs.constants.W_OK);
    ensure(!accessError, accessError?.message ?? 'Can not find ModuleData directory', ErrorCodes.EACCES_FILE);

    let directoryPath: string;
    if (sourceLanguage.code === 'EN') {
        directoryPath = `${moduleDataPath}\\Languages\\${sourceLanguage.code}`;
        const [accessError] = run<void, NodeError>(fs.accessSync, directoryPath, fs.constants.R_OK | fs.constants.W_OK);
        if (accessError) directoryPath = `${moduleDataPath}\\Languages`;
    } else {
        directoryPath = `${moduleDataPath}\\Languages\\${sourceLanguage.code}`;
        const [accessError] = run<void, NodeError>(fs.accessSync, directoryPath, fs.constants.R_OK | fs.constants.W_OK);
        ensure(
            !accessError,
            accessError?.message ?? `Can not found \\Languages\\${sourceLanguage.code} directory`,
            ErrorCodes.ENOENT_FILE,
        );
    }

    const [error, dictionary] = run<ModuleDataDictionary>(getModuleDataDictionary, directoryPath, {
        enabledExtension: ['xml'],
        enabledTags: ['base.strings.string', 'strings.string'],
    });
    ensure(!error, error?.message ?? 'An error occurred while organizing translatable files');
    ensure(dictionary.size, 'No files available for translation', ErrorCodes.EINVAL_LANG_FILE_EMPTY);

    const { code, nativeName } = targetLanguage;
    const [writeError] = run<void, NodeError>(writeLanguageDataXml, dictionary, moduleDataPath, nativeName, code);
    ensure(!writeError, writeError?.message ?? 'Unable to parse language_data.xml', writeError?.code);

    return dictionary;
}

function getModuleDataDictionary(
    languageDataPath: string,
    { enabledExtension, enabledTags }: Record<'enabledExtension' | 'enabledTags' | 'illegalKeys', string[]>,
): ModuleDataDictionary {
    const dictionary = new Map<string, ModuleDataItemOption>();

    for (const file of fs.readdirSync(languageDataPath)) {
        const fileExtension = file.split('.').pop();
        if (!fileExtension || !enabledExtension.includes(fileExtension)) continue;

        let result: ModuleDataItemOption = {};
        const record = translationDataXml.read(languageDataPath, file);
        for (const tag of enabledTags) {
            let items = get(record, tag);
            if (!items) continue;

            const isSingle = isObject(items);
            if (isSingle) {
                // { '@_id': string, '@_text': string }[]
                items = [items];
            }

            result = items.reduce(
                (accumulator: ModuleDataItemOption, current: Record<string, string>, index: number) => {
                    const name = get(current, '@_text');
                    if (!name) return accumulator;

                    const key = get(current, '@_id');
                    if (!key) return accumulator;

                    return { ...accumulator, [`row_${index}`]: { name, key } };
                },
                {},
            );
        }

        if (Object.keys(result).length === 0) {
            continue;
        }

        dictionary.set(file, result);
    }

    return dictionary;
}

export default normalizeLanguageData;
