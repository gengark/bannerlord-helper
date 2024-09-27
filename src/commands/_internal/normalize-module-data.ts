import fs from 'node:fs';
import get from 'lodash.get';
import merge from 'lodash.merge';
import set from 'lodash.set';
import { ErrorCodes, type LanguageRecord } from '../../shared/index.js';
import { ensure, hash, isObject, type NodeError, readFileSync, run, XML } from '../../utils/index.js';
import writeLanguageDataXml from './write-language-data-xml.js';

// ModItem { id: { name, key } }
type ModuleDataItemOption = Record<
    string,
    {
        name: string;
        key: string;
    }
>;

export type ModuleDataDictionary = Map<string, ModuleDataItemOption>;

function normalizeModuleData(moduleDataPath: string, language: LanguageRecord): ModuleDataDictionary {
    const [accessError] = run<void, NodeError>(fs.accessSync, moduleDataPath, fs.constants.R_OK | fs.constants.W_OK);
    ensure(!accessError, accessError?.message ?? 'Can not find ModuleData directory', ErrorCodes.EACCES_FILE);

    const [error, dictionary] = run<ModuleDataDictionary>(getModuleDataDictionary, moduleDataPath, {
        enabledExtension: ['xml'],
        enabledTags: [
            'Items.Item',
            'Items.CraftedItem',
            'CraftingPieces.CraftingPiece',
            'NPCCharacters.NPCCharacter',
            'Settlements.Settlement',
            'LocationComplexTemplates.LocationComplexTemplate.Location',
        ],
        illegalKeys: ['*'],
        freezeKeys: ['!'],
    });
    ensure(!error, error?.message ?? 'An error occurred while organizing translatable files');
    ensure(dictionary.size, 'No files available for translation', ErrorCodes.EINVAL_LANG_FILE_EMPTY);

    const { code, nativeName } = language;
    const [writeError] = run<void, NodeError>(writeLanguageDataXml, dictionary, moduleDataPath, nativeName, code);
    ensure(!writeError, writeError?.message ?? 'Unable to parse language_data.xml', writeError?.code);

    return dictionary;
}

function getModuleDataDictionary(
    moduleDataPath: string,
    {
        enabledExtension,
        enabledTags,
        illegalKeys,
        freezeKeys,
    }: Record<'enabledExtension' | 'enabledTags' | 'illegalKeys' | 'freezeKeys', string[]>,
): ModuleDataDictionary {
    const dictionary = new Map<string, ModuleDataItemOption>();

    for (const file of fs.readdirSync(moduleDataPath)) {
        const fileExtension = file.split('.').pop();
        if (!fileExtension || !enabledExtension.includes(fileExtension)) continue;

        const filePath = `${moduleDataPath}\\${file}`;
        const fileContent = readFileSync(filePath);

        const disabledKey = new Set<string>(illegalKeys);
        let result: ModuleDataItemOption = {};

        const record = XML.parse<Record<string, any>>(fileContent);
        for (const tag of enabledTags) {
            let items = get(record, tag);
            if (!items) continue;

            const isSingle = isObject(items);
            if (isSingle) {
                items = [items];
            }

            const scoped = items.reduce((accumulator: ModuleDataItemOption, current: Record<string, string>) => {
                const value = get(current, '@_name');
                if (!value) return accumulator;

                const id = get(current, '@_id');
                if (!id) return accumulator;

                const key = /^{=[\s\w*!]+}/.exec(value)?.[0]?.replace(/^{=|}$/g, '');
                if (key && freezeKeys.includes(key)) return accumulator;

                const name = key ? value.replace(`{=${key}}`, '') : value;
                if (!name) return accumulator;

                const pureKey = !key || disabledKey.has(key) ? hash(`${file}${id}${name}`, 8) : key;
                disabledKey.add(pureKey);
                return { ...accumulator, [id]: { name, key: pureKey } };
            }, {});

            if (Object.keys(scoped).length === 0) continue;

            for (const [index, item] of items.entries()) {
                const matching = scoped[item['@_id']];
                if (!matching) continue;

                const recordPath = isSingle ? `${tag}.@_name` : `${tag}.${index}.@_name`;
                set(record, recordPath, `{=${matching.key}}${matching.name}`);
            }

            result = merge(result, scoped);
        }

        if (Object.keys(result).length === 0) {
            continue;
        }

        dictionary.set(file, result);
        const nextFileContent = XML.stringify(record);
        fs.writeFileSync(filePath, nextFileContent);
    }

    return dictionary;
}

export default normalizeModuleData;
