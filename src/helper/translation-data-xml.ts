import fs from 'node:fs';
import cloneDeep from 'lodash.clonedeep';
import get from 'lodash.get';
import set from 'lodash.set';
import uniqBy from 'lodash.uniqby';
import { ErrorCodes } from '../shared/index.js';
import { ensure, isObject, type NodeError, readFileSync, run, XML } from '../utils/index.js';

interface TranslationDataXmlHeader {
    '@_version': '1.0';
    '@_encoding': 'utf-16';
}

interface TranslationDataXmlTag {
    /** Language Native Name */
    '@_language': string;
}

interface TranslationDataXmlString {
    /** Translate Key */
    '@_id': string;
    /** Translation */
    '@_text': string;
}

interface TranslationDataXmlData {
    '@_type': string;
    '@_xmlns:xsi': string;
    '@_xmlns:xsd': string;
    tags: {
        tag: TranslationDataXmlTag;
    };
    strings: {
        string: TranslationDataXmlString | TranslationDataXmlString[];
    };
}

export interface TranslationDataXml {
    '?xml': TranslationDataXmlHeader;
    base: TranslationDataXmlData;
}

const createXmlHeader = (): TranslationDataXmlHeader => ({
    '@_version': '1.0',
    '@_encoding': 'utf-16',
});

const createTranslationTag = (langName: string): TranslationDataXmlTag => ({
    '@_language': langName,
});

const createTranslationStrings = (options: Array<{ key: string; name: string }>): TranslationDataXmlString[] => {
    return options.map((option: { key: string; name: string }) => ({
        '@_id': option.key,
        '@_text': option.name,
    }));
};

const createTranslationData = (
    langName: string,
    options: Array<{ key: string; name: string }>,
): TranslationDataXmlData => ({
    '@_type': 'string',
    '@_xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
    '@_xmlns:xsd': 'http://www.w3.org/2001/XMLSchema',
    tags: {
        tag: createTranslationTag(langName),
    },
    strings: {
        string: createTranslationStrings(options),
    },
});

const createWithTemplate = (name: string, options: Array<{ key: string; name: string }>): TranslationDataXml => ({
    '?xml': createXmlHeader(),
    base: createTranslationData(name, options),
});

const normalizeFileName = (name: string) => {
    const nextName = name.replace(/^\/+/, '');
    if (/.xml$/.test(nextName)) {
        return nextName;
    }

    return `${nextName}.xml`;
};

export function create(langName: string, options: Array<{ key: string; name: string }>) {
    ensure(
        langName && options?.length,
        'Invalid language name or no item available for translation',
        ErrorCodes.EINVAL_LANG_OPTS_EMPTY,
    );

    return createWithTemplate(langName, options);
}

export function merge(data: TranslationDataXml, source: TranslationDataXml) {
    const dataStrings = get(data, 'base.strings.string', []);
    const dataStringList = isObject<TranslationDataXmlString>(dataStrings) ? [dataStrings] : dataStrings;

    const sourceStrings = get(source, 'base.strings.string', []);
    const sourceStringList = isObject<TranslationDataXmlString>(sourceStrings) ? [sourceStrings] : sourceStrings;

    const combinedStrings = uniqBy([...dataStringList, ...sourceStringList], '@_id');
    return set(cloneDeep(data), 'base.strings.string', combinedStrings);
}

export function check(directoryPath: string, fileName: string): boolean {
    const filePath = `${directoryPath}\\${normalizeFileName(fileName)}`;
    const [error] = run<void, NodeError>(fs.accessSync, filePath, fs.constants.R_OK | fs.constants.W_OK);
    return !error;
}

export function read(directoryPath: string, fileName: string): TranslationDataXml {
    const filePath = `${directoryPath}\\${normalizeFileName(fileName)}`;
    const [accessError] = run<void, NodeError>(fs.accessSync, filePath, fs.constants.R_OK | fs.constants.W_OK);
    ensure(
        !accessError,
        accessError?.message ?? 'No such file or directory',
        accessError?.code ?? ErrorCodes.ENOENT_FILE,
    );

    const content = readFileSync(filePath);
    const [parseError, xmlData] = run<TranslationDataXml, NodeError>(XML.parse, content);
    ensure(!parseError, parseError?.message ?? 'Unable to parse xml file', ErrorCodes.EINVAL_XML_DATA);

    return xmlData;
}

export function write(directoryPath: string, fileName: string, content: TranslationDataXml) {
    const [accessError] = run<void, NodeError>(fs.accessSync, directoryPath, fs.constants.R_OK | fs.constants.W_OK);
    ensure(!accessError, accessError?.message ?? 'Permission denied', accessError?.code ?? ErrorCodes.ENOENT_FILE);

    const fileContent = XML.stringify<TranslationDataXml>(content);

    const [writeError] = run<void, NodeError>(
        fs.writeFileSync,
        `${directoryPath}\\${normalizeFileName(fileName)}`,
        fileContent,
        'utf8',
    );
    ensure(!writeError, writeError?.message ?? 'Permission denied', writeError?.code ?? ErrorCodes.EACCES_FILE);
}
