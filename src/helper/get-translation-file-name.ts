import { Languages } from '../shared/index.js';

function getTranslationFileName(fileName: string, codeSuffix?: string): string {
    const fileNameParts = fileName.split('.');
    const [fileExtension, ...otherParts] = fileNameParts.reverse();

    const suffixRegex = new RegExp(
        `^std_|_${Languages.getAllCodes()
            .map((item) => item.toLowerCase())
            .join('|_')}$`,
        'g',
    );
    const pureFileName = otherParts.pop()?.replace(suffixRegex, '');
    const otherSuffixes = otherParts.reverse();

    const nextFileName = ['std', pureFileName, codeSuffix?.toLowerCase()].filter(Boolean).join('_');
    const nextExtension = [...otherSuffixes, fileExtension].filter(Boolean).join('.');

    return [nextFileName, nextExtension].join('.');
}

export default getTranslationFileName;
