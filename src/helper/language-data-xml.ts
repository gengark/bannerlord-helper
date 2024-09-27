import fs from 'node:fs';
import cloneDeep from 'lodash.clonedeep';
import get from 'lodash.get';
import set from 'lodash.set';
import uniqBy from 'lodash.uniqby';
import { ErrorCodes } from '../shared/index.js';
import { ensure, isObject, type NodeError, readFileSync, run, XML } from '../utils/index.js';

interface LanguageDataXmlHeader {
    '@_version': '1.0';
    '@_encoding': 'utf-16';
}

interface LanguageDataXmlItem {
    '@_xml_path': string;
}

interface LanguageDataXmlData {
    LanguageFile: LanguageDataXmlItem | LanguageDataXmlItem[];
    '@_id': string;
}

export interface LanguageDataXml {
    '?xml': LanguageDataXmlHeader;
    LanguageData: LanguageDataXmlData;
}

const LANGUAGE_DATA_XML_FILE_NAME = 'language_data.xml';

const createXmlHeader = (): LanguageDataXmlHeader => ({
    '@_version': '1.0',
    '@_encoding': 'utf-16',
});

const createLanguageFile = (code: string, file: string): LanguageDataXmlItem => {
    return { '@_xml_path': `${code}/${file}` };
};

const createLanguageFiles = (code: string, files: string[]): LanguageDataXmlItem[] => {
    return files.map((item) => createLanguageFile(code, item));
};

const createLanguageData = (name: string, code: string, files: string[]): LanguageDataXmlData => ({
    LanguageFile: createLanguageFiles(code, files),
    '@_id': name,
});

const createWithTemplate = (name: string, code: string, files: string[]): LanguageDataXml => ({
    '?xml': createXmlHeader(),
    LanguageData: createLanguageData(name, code, files),
});

const resolveFilePath = (directoryPath: string) => {
    return `${directoryPath}\\${LANGUAGE_DATA_XML_FILE_NAME}`;
};

const normalizeFileName = (name: string) => {
    const nextName = name.replace(/^\/+/, '');
    if (/.xml$/.test(nextName)) {
        return nextName;
    }

    return `${nextName}.xml`;
};

export function create(langName: string, langCode: string, langFiles: string[]) {
    ensure(
        langName && langCode && langFiles?.length,
        'Invalid LanguageName/LanguageCode or empty files',
        ErrorCodes.EINVAL_LANG_FILE_EMPTY,
    );

    const files = langFiles.map(normalizeFileName);
    return createWithTemplate(langName, langCode, files);
}

export function merge(data: LanguageDataXml, source: LanguageDataXml) {
    const languageFiles = get(data, 'LanguageData.LanguageFile', []);
    const languageFileList = isObject<LanguageDataXmlItem>(languageFiles) ? [languageFiles] : languageFiles;

    const sourceFiles = get(source, 'LanguageData.LanguageFile', []);
    const sourceFileList = isObject<LanguageDataXmlItem>(sourceFiles) ? [sourceFiles] : sourceFiles;

    const combinedFiles = uniqBy([...languageFileList, ...sourceFileList], '@_xml_path');
    return set(cloneDeep(data), 'LanguageData.LanguageFile', combinedFiles);
}

export function check(directoryPath: string): boolean {
    const filePath = resolveFilePath(directoryPath);
    const [error] = run<void, NodeError>(fs.accessSync, filePath, fs.constants.R_OK | fs.constants.W_OK);
    return !error;
}

export function read(directoryPath: string): LanguageDataXml {
    const filePath = resolveFilePath(directoryPath);
    const [accessError] = run<void, NodeError>(fs.accessSync, filePath, fs.constants.R_OK | fs.constants.W_OK);
    ensure(
        !accessError,
        accessError?.message ?? 'No such file or directory',
        accessError?.code ?? ErrorCodes.ENOENT_FILE,
    );

    const content = readFileSync(filePath);
    const [parseError, xmlData] = run<LanguageDataXml, NodeError>(XML.parse, content);
    ensure(!parseError, parseError?.message ?? 'Unable to parse language_data.xml', ErrorCodes.EINVAL_XML_DATA);

    return xmlData;
}

export function write(directoryPath: string, content: LanguageDataXml) {
    const [accessError] = run<void, NodeError>(fs.accessSync, directoryPath, fs.constants.R_OK | fs.constants.W_OK);
    ensure(!accessError, accessError?.message ?? 'Permission denied', accessError?.code ?? ErrorCodes.ENOENT_FILE);

    const filePath = resolveFilePath(directoryPath);
    const fileContent = XML.stringify<LanguageDataXml>(content);

    const [writeError] = run<void, NodeError>(fs.writeFileSync, filePath, fileContent, 'utf8');
    ensure(!writeError, writeError?.message ?? 'Permission denied', writeError?.code ?? ErrorCodes.EACCES_FILE);
}
