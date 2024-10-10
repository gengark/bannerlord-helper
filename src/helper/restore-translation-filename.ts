import { languageDictionary } from '../shared';

function restoreTranslationFilename(filename: string) {
    const fileNameParts = filename.split('.');
    const [fileExtension, ...otherParts] = fileNameParts.reverse();

    const pureFileName = otherParts.pop();
    const otherSuffixes = otherParts.reverse();

    const suffixRegex = new RegExp(
        `^std_|_${languageDictionary
            .getAllLanguages()
            .reverse()
            .map((item) => item.suffix)
            .join('|_')}$`,
        'g',
    );
    const nextFileName = pureFileName?.replace(suffixRegex, '');
    const nextExtension = [...otherSuffixes, fileExtension].filter(Boolean).join('.');

    return [nextFileName, nextExtension].join('.');
}

export default restoreTranslationFilename;
