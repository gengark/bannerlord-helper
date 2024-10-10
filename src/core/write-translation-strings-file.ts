import get from 'lodash.get';
import { translate, type TranslateOptions } from '../api';
import type { ModuleTranslateStatOptions } from '../components';
import { LanguageStringsXml } from '../helper';
import { languageDictionary } from '../shared';
import { pathExist } from '../utils';

async function writeTranslationStringsFile(
    sourcePath: string,
    targetPath: string,
    options: TranslateOptions & { prefix?: string },
): Promise<Omit<ModuleTranslateStatOptions, 'filename' | 'status'>> {
    const { prefix = '', ...restOptions } = options;
    const instance = new LanguageStringsXml();

    const targetData = instance.read(sourcePath);
    const items = instance
        .normalizeLanguageStrings(get(targetData, 'base.strings.string', []))
        .map((item) => ({ id: item['@_id'], text: item['@_text'] }));
    if (items.length === 0) return { targetIds: [], ids: [], appendIds: [] };

    const contents = items.map((item) => item.text);
    const translations = await translate(contents, {
        ...restOptions,
        protect: true,
    });
    const result = items.map((item, index) => ({ id: item.id, text: `${prefix}${translations[index] ?? item.text}` }));

    const data = pathExist(targetPath) ? instance.read(targetPath) : undefined;
    const sourceData = instance.create(languageDictionary.getNativeName(restOptions.to)!, result);
    const compositeData = data ? instance.merge(data, sourceData) : sourceData;

    const targetIds = items.map((item) => item.id);
    const ids = instance.normalizeLanguageStrings(get(data, 'base.strings.string', [])).map((item) => item['@_id']);
    const appendIds = result.map((item) => item.id).filter((id) => !ids.includes(id));

    instance.write(targetPath, compositeData);
    return { targetIds, ids, appendIds };
}

export default writeTranslationStringsFile;
