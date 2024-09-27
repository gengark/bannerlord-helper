import { Languages } from '../shared/index.js';

function restoreTranslationFileName(fileName: string) {
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

    const nextExtension = [...otherSuffixes, fileExtension].filter(Boolean).join('.');

    return [pureFileName, nextExtension].join('.');
}

export default restoreTranslationFileName;
