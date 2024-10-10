import ora from 'ora';
import { renderModuleGenerateStat } from '../components';
import {
    choiceModuleDataFiles,
    normalizeTranslateOptions,
    writeLanguageDataFile,
    writeLanguageStringsFile,
} from '../core';
import { getLanguageTargetPath, getModuleDataItems, getTranslationFilename, useDurationPrint } from '../helper';
import clearLanguagesDirectory from '../helper/clear-languages-directory';
import { $t } from '../shared';
import { ensureDirectory, op, to } from '../utils';

export interface GenerateCommandOptions {
    engine?: string;
    language?: string;
    to?: string;
    force?: boolean;
}

async function generate({ engine, language, to: target, force }: GenerateCommandOptions = {}) {
    const spinner = ora({ color: 'cyan' });
    const [langError, options] = op(normalizeTranslateOptions, { engine, target, source: language });
    if (langError) {
        spinner.fail(langError.message);
        return;
    }

    const { translateEngine, translateFrom, translateTo = 'EN' } = options;

    const { path: modulePath, files } =
        (await choiceModuleDataFiles({ engine: translateEngine, to: translateFrom })) ?? {};
    if (!modulePath || !files) return;
    const moduleDataPath = `${modulePath}\\ModuleData`;

    const languagesPath = getLanguageTargetPath(moduleDataPath, translateTo);
    ensureDirectory(languagesPath);

    if (force) {
        const [error] = await to(clearLanguagesDirectory(languagesPath, 'xml'));
        if (error) return;
    }

    let currentIndex = 0;
    const spinnerMessage = $t('CMD_GENERATE_GEN_TRANSLATION_TEMPLATE');
    const getSpinnerText = () => `${spinnerMessage} (${currentIndex++}/${files.length})`;

    const printDuration = useDurationPrint();
    spinner.start(getSpinnerText());

    const stats = [];
    const filenameDictionary = new Map<string, string>();
    for (const file of files) {
        const filename = getTranslationFilename(file, translateTo);
        const currentFilepath = `${languagesPath}\\${filename}`;
        const items = getModuleDataItems(moduleDataPath, file);
        if (items.size === 0) {
            stats.push({ filename, targetIds: [], ids: [], appendIds: [] });
            continue;
        }

        filenameDictionary.set(file, filename);
        const stat = writeLanguageStringsFile(currentFilepath, translateTo, items);
        stats.push({ filename, ...stat });
        spinner.text = getSpinnerText();
    }

    spinner.succeed(getSpinnerText());

    const standardFiles = files.map((item) => filenameDictionary.get(item)).filter(Boolean) as string[];
    writeLanguageDataFile(languagesPath, translateTo, standardFiles);

    const md = await renderModuleGenerateStat(stats);
    console.log(md);
    printDuration();
}

export default generate;
