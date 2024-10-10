import get from 'lodash.get';
import uniqBy from 'lodash.uniqby';
import { LanguageStringsXml, type ModuleDataItemOptions } from '../helper';
import { $t, languageDictionary } from '../shared';
import { ensure, pathExist } from '../utils';

function writeLanguageStringsFile(filepath: string, code: string, mapping: Map<string, ModuleDataItemOptions[]>) {
    const instance = new LanguageStringsXml();
    const nativeName = languageDictionary.getNativeName(code)!;
    ensure(nativeName, $t('EINVAL_LANGUAGE_CODE'), 'EINVAL_LANGUAGE_CODE');
    const uniqueItems = uniqBy([...mapping.values()].flat(), 'key').map((item) => ({ id: item.key, text: item.name }));

    const data = pathExist(filepath) ? instance.read(filepath) : undefined;
    const source = instance.create(nativeName, uniqueItems);
    const composite = data ? instance.merge(data, source) : source;

    const targetIds = uniqueItems.map((item) => item.id);
    const ids = instance.normalizeLanguageStrings(get(data, 'base.strings.string', [])).map((item) => item['@_id']);
    const appendIds = targetIds.filter((id) => !ids.includes(id));

    instance.write(filepath, composite);
    return { targetIds, ids, appendIds };
}

export default writeLanguageStringsFile;
