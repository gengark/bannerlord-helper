import get from 'lodash.get';
import { XML_CONFIGURATION } from '../constants';
import { type Arrayable, hash, isPlainObject } from '../utils';
import ModuleXml, { type XmlStandardOptions } from './module-xml';

export interface ModuleDataItemXmlOptions {
    [key: string]: unknown;
    '@_id': string;
    '@_name'?: string;
    '@_text'?: string;
    '@_title'?: string;
}

export interface ModuleDataItemOptions {
    id: string;
    name: string;
    key: string;
    type: string;
    path: string;
}

function getModuleDataItems(directoryPath: string, filename: string): Map<string, ModuleDataItemOptions[]> {
    const instance = new ModuleXml<XmlStandardOptions & Record<string, unknown>>();
    const data = instance.read(`${directoryPath}\\${filename}`);

    const { ENABLED_XML_TAG_PATHS: enabledTags } = XML_CONFIGURATION;
    const matching = new Map<string, ModuleDataItemOptions[]>();
    for (const path of Object.keys(enabledTags)) {
        const items = get(data, path) as Arrayable<ModuleDataItemXmlOptions>;
        if (!items) continue;

        const deprecatedKeys = new Map<string, string>();
        const isSingle = isPlainObject<ModuleDataItemXmlOptions>(items);
        if (isSingle) {
            const option = getModuleDataItemOptions(
                items,
                filename,
                { path, valueKey: enabledTags[path as keyof typeof enabledTags] },
                deprecatedKeys,
            );
            matching.set(path, option ? [option] : []);
        } else {
            const options = items
                .map((item) =>
                    getModuleDataItemOptions(
                        item,
                        filename,
                        { path, valueKey: enabledTags[path as keyof typeof enabledTags] },
                        deprecatedKeys,
                    ),
                )
                .filter(Boolean) as ModuleDataItemOptions[];
            matching.set(path, options);
        }
    }

    return matching;
}

function getModuleDataItemOptions(
    item: ModuleDataItemXmlOptions,
    filename: string,
    { path, valueKey }: { path: string; valueKey: string },
    reuseMap: Map<string, string>,
): ModuleDataItemOptions | undefined {
    if (!path || !valueKey) return;

    const id = get(item, '@_id');
    const value = get(item, `@_${valueKey}`) as string;
    if (!id || !value) return;

    const { ESCAPED_IDENTIFIERS: escapedKeys, DISABLED_IDENTIFIERS: disabledKeys } = XML_CONFIGURATION;
    const originalKey = /^{=[\s\w*!]+}/.exec(value)?.[0]?.replace(/^{=|}$/g, '');
    if (originalKey && escapedKeys.includes(originalKey)) return;

    const name = originalKey ? value.replace(`{=${originalKey}}`, '') : value;
    if (!name) return;

    let uniqueKey: string | undefined;
    if (!originalKey) uniqueKey = reuseMap.get(name);
    else if (!disabledKeys.includes(originalKey)) uniqueKey = originalKey;

    uniqueKey ||= hash(`${filename}${id}${name}`, 8);

    reuseMap.set(name, uniqueKey);
    return { id, name, key: uniqueKey, type: valueKey, path };
}

export default getModuleDataItems;
