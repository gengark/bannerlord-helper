import get from 'lodash.get';
import ModuleXml, { type XmlStandardOptions } from './module-xml';
import type { ModuleDataItemOptions, ModuleDataItemXmlOptions } from './get-module-data-items';

function identifyModuleDataItem(scoped: ModuleDataItemXmlOptions, item: ModuleDataItemOptions) {
    const content = scoped?.[`@_${item.type}`];
    if (typeof content !== 'string') return -1;
    if (/^{=[\s\w*!]+}/.test(content)) return 0;

    scoped[`@_${item.type}`] = `{=${item.key}}${item.name}`;
    return 1;
}

function identifyModuleDataFile(
    directoryPath: string,
    filename: string,
    mapping: Map<string, ModuleDataItemOptions[]>,
) {
    const instance = new ModuleXml<XmlStandardOptions & Record<string, unknown>>();
    const data = instance.read(`${directoryPath}\\${filename}`);

    let successCount = 0;
    let noopCount = 0;
    let failedCount = 0;
    for (const path of mapping.keys()) {
        const list = mapping.get(path) ?? [];
        if (list.length === 0) continue;

        const isSingle = list.length === 1;
        const record = get(data, path) as ModuleDataItemXmlOptions;
        for (const [index, item] of list.entries()) {
            const scoped = (isSingle ? record : record[index]) as ModuleDataItemXmlOptions;
            const status = identifyModuleDataItem(scoped, item);
            if (status < 0) failedCount++;
            else if (status) {
                successCount++;
            } else {
                noopCount++;
            }
        }
    }

    instance.write(`${directoryPath}\\${filename}`, data);
    return { successCount, noopCount, failedCount };
}

export default identifyModuleDataFile;
