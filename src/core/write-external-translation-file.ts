import get from 'lodash.get';
import uniqBy from 'lodash.uniqby';
import { translate, type TranslateOptions } from '../api';
import type { ModuleTranslateStatOptions } from '../components';
import { ExternalXslt, type ExternalXsltAttributeOptions, type ModuleDataItemOptions } from '../helper';
import { pathExist } from '../utils';

function getMatchOptions(options: ExternalXsltAttributeOptions[]) {
    return options
        .map((item) => ({
            id: /@id='([^']+)'/.exec(item['@_match'])?.[1],
            type: item['xsl:attribute']['@_name'],
            key: /^(\w+)/.exec(item['@_match'])?.[1],
            text: item['xsl:attribute']['#text'],
        }))
        .filter((item) => item.id && item.key && item.text && item.type);
}

async function writeExternalTranslationFile(
    filepath: string,
    mapping: Map<string, ModuleDataItemOptions[]>,
    options: TranslateOptions & { prefix?: string },
): Promise<Omit<ModuleTranslateStatOptions, 'filename' | 'status'>> {
    const { prefix = '', ...restOptions } = options;
    const instance = new ExternalXslt();

    const uniqueItems = uniqBy([...mapping.values()].flat(), 'id').map((item) => ({
        id: item.id,
        key: item.type,
        text: item.name,
        type: item.path.split('.').pop()!,
    }));
    if (uniqueItems.length === 0) return { targetIds: [], ids: [], appendIds: [] };

    const contents = uniqueItems.map((item) => item.text);
    const translations = await translate(contents, {
        ...restOptions,
        protect: true,
    });
    const result = uniqueItems.map((item, index) => ({
        ...item,
        text: `${prefix}${translations[index] ?? item.text}`,
    }));

    const data = pathExist(filepath) ? instance.read(filepath) : undefined;
    const source = instance.create(result);
    const composite = data ? instance.merge(data, source) : source;

    const targetIds = uniqueItems.map((item) => item.id);
    const ids = getMatchOptions(instance.normalizeTemplate(get(data, 'xsl:stylesheet.xsl:template', []))).map(
        (item) => item.id!,
    );
    const appendIds = targetIds.filter((id) => !ids.includes(id));

    instance.write(filepath, composite);
    return { targetIds, ids, appendIds };
}

export default writeExternalTranslationFile;
