import path from 'node:path';
import cloneDeep from 'lodash.clonedeep';
import get from 'lodash.get';
import set from 'lodash.set';
import uniqBy from 'lodash.uniqby';
import { type Arrayable, isPlainObject } from '../utils';
import ModuleXml, { type XmlStandardOptions } from './module-xml';

interface LanguageTagOptions {
    /** Language Native Name */
    '@_language': string;
}

export interface LanguageStringOptions {
    /** Translate Key */
    '@_id': string;
    /** Translation */
    '@_text': string;
}

export interface LanguageBaseOptions {
    tags: { tag: Arrayable<LanguageTagOptions> } | '';
    strings: { string: Arrayable<LanguageStringOptions> } | '';
    '@_type': 'string';
    '@_xmlns:xsd': 'http://www.w3.org/2001/XMLSchema';
    '@_xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance';
}

export interface LanguageStringsXmlOptions extends XmlStandardOptions {
    base: LanguageBaseOptions;
}

class LanguageStringsXml extends ModuleXml<LanguageStringsXmlOptions> {
    resolve(filepath: string) {
        const directoryPath = path.dirname(filepath);
        const filename = path.basename(filepath);
        return path.resolve(directoryPath, this.normalizeFilename(filename));
    }

    create(
        languages: Arrayable<string> | string,
        list: Array<{ id: string; text: string }>,
    ): LanguageStringsXmlOptions {
        return { ...this.createHeader(), base: this.createLanguageBase(languages, list) };
    }

    merge(data: LanguageStringsXmlOptions, source?: LanguageStringsXmlOptions): LanguageStringsXmlOptions {
        if (!source) return data;

        const languageStrings = get(data, 'base.strings.string', []);
        const languageStringList = this.normalizeLanguageStrings(languageStrings);

        const sourceStrings = get(source, 'base.strings.string', []);
        const sourceStringList = this.normalizeLanguageStrings(sourceStrings);

        const compositeStrings = uniqBy([...languageStringList, ...sourceStringList], '@_id');
        return set(cloneDeep(data), 'base.strings.string', compositeStrings);
    }

    read(filepath: string) {
        return super.read(this.resolve(filepath));
    }

    write(filepath: string, data: LanguageStringsXmlOptions) {
        return super.write(this.resolve(filepath), data);
    }

    normalizeFilename(filename: string) {
        const _filename = filename.replace(/^[/\\]+/, '');
        if (/.xml$/.test(_filename)) {
            return _filename;
        }

        return `${_filename}.xml`;
    }

    normalizeLanguageStrings(list: Arrayable<LanguageStringOptions>) {
        if (isPlainObject<LanguageStringOptions>(list)) return [list];
        return list;
    }

    protected createLanguageBase(
        languages: Arrayable<string> | string,
        list: Array<{ id: string; text: string }>,
    ): LanguageBaseOptions {
        /* eslint-disable @typescript-eslint/naming-convention */
        return {
            tags: this.createLanguageTags(languages),
            strings: this.createLanguageStrings(list),
            '@_type': 'string',
            '@_xmlns:xsd': 'http://www.w3.org/2001/XMLSchema',
            '@_xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
        };
        /* eslint-enable @typescript-eslint/naming-convention */
    }

    protected createLanguageTags(languages: Arrayable<string>) {
        if (typeof languages === 'string') languages = [languages];

        return this.createArrayableTag<'tag', string, LanguageTagOptions>(
            'tag',
            languages,
            /* eslint-disable @typescript-eslint/naming-convention */
            (item): LanguageTagOptions => ({
                '@_language': item,
            }),
            /* eslint-enable @typescript-eslint/naming-convention */
        );
    }

    protected createLanguageStrings(options: Array<{ id: string; text: string }>) {
        return this.createArrayableTag<'string', { id: string; text: string }, LanguageStringOptions>(
            'string',
            options,
            /* eslint-disable @typescript-eslint/naming-convention */
            (item): LanguageStringOptions => ({
                '@_id': item.id,
                '@_text': item.text,
            }),
            /* eslint-enable @typescript-eslint/naming-convention */
        );
    }
}

export default LanguageStringsXml;
