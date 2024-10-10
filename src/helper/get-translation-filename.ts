import { languageDictionary } from '../shared';

function getTranslationFilename(filename: string, code = 'EN'): string {
    const filenameParts = filename.split('.');
    const [fileExtension, ...otherParts] = filenameParts.reverse();

    const languageSuffix = languageDictionary.getLanguage(code)!.suffix;
    const pureFileName = otherParts.pop();
    const otherSuffixes = otherParts.reverse();

    const nextFileName = ['std', pureFileName, languageSuffix].filter(Boolean).join('_');
    const nextExtension = [...otherSuffixes, fileExtension].filter(Boolean).join('.');

    return [nextFileName, nextExtension].join('.');
}

export default getTranslationFilename;
