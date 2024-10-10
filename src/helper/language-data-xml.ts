import path from 'node:path';
import cloneDeep from 'lodash.clonedeep';
import get from 'lodash.get';
import set from 'lodash.set';
import uniqBy from 'lodash.uniqby';
import { type Arrayable, isPlainObject } from '../utils';
import ModuleXml, { type LiteralBoolean, type XmlStandardOptions } from './module-xml';

export interface LanguageFileOptions {
    '@_xml_path': string;
}

export interface LanguageDataOptions {
    LanguageFile: Arrayable<LanguageFileOptions> | '';
    '@_id': string;
    '@_name'?: string;
    '@_subtitle_extension'?: string;
    '@_supported_iso'?: string;
    '@_under_development'?: LiteralBoolean;
}

export interface LanguageDataXmlOptions extends XmlStandardOptions {
    LanguageData: LanguageDataOptions;
}

class LanguageDataXml extends ModuleXml<LanguageDataXmlOptions> {
    resolve(directoryPath: string) {
        return path.resolve(directoryPath, 'language_data.xml');
    }

    create(name: string, code: string, files: string[]): LanguageDataXmlOptions {
        const list = files.map((item) => this.normalizeFilename(item));
        // eslint-disable-next-line @typescript-eslint/naming-convention
        return { ...this.createHeader(), LanguageData: this.createLanguageData(name, code, list) };
    }

    merge(data: LanguageDataXmlOptions, source?: LanguageDataXmlOptions): LanguageDataXmlOptions {
        if (!source) return data;

        const languageFiles = get(data, 'LanguageData.LanguageFile', []);
        const languageFileList = this.normalizeLanguageFile(languageFiles);

        const sourceFiles = get(source, 'LanguageData.LanguageFile', []);
        const sourceFileList = this.normalizeLanguageFile(sourceFiles);

        const compositeFiles = uniqBy([...languageFileList, ...sourceFileList], '@_xml_path');
        return set(cloneDeep(data), 'LanguageData.LanguageFile', compositeFiles);
    }

    read(directoryPath: string) {
        return super.read(this.resolve(directoryPath));
    }

    write(directoryPath: string, data: LanguageDataXmlOptions) {
        return super.write(this.resolve(directoryPath), data);
    }

    normalizeFilename(filename: string) {
        const _filename = filename.replace(/^[/\\]+/, '');
        if (/.xml$/.test(_filename)) {
            return _filename;
        }

        return `${_filename}.xml`;
    }

    normalizeLanguageFile(files: LanguageDataOptions['LanguageFile']) {
        if (typeof files === 'string') return [];
        if (isPlainObject<LanguageFileOptions>(files)) return [files];
        return files;
    }

    protected createLanguageData(name: string, code: string, files: string[]): LanguageDataOptions {
        /* eslint-disable @typescript-eslint/naming-convention */
        return {
            LanguageFile: this.createLanguageFiles(code, files),
            '@_id': name,
            '@_name': name,
        };
        /* eslint-enable @typescript-eslint/naming-convention */
    }

    protected createLanguageFiles(code: string, files: string[]) {
        if (files.length === 0) return '';

        if (files.length === 1) return this.createLanguageFile(code, files[0]);

        return files.map((file) => this.createLanguageFile(code, file));
    }

    protected createLanguageFile(code: string, file: string) {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        return { '@_xml_path': `${code}/${file}` };
    }
}

export default LanguageDataXml;
