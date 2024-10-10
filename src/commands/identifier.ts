import ora from 'ora';
import { renderModuleIdentifierStat } from '../components';
import { choiceModuleDataFiles, normalizeTranslateOptions } from '../core';
import { getModuleDataItems, identifyModuleDataFile, useDurationPrint } from '../helper';
import { $t } from '../shared';
import { op } from '../utils';

export interface IdentifierCommandOptions {
    language?: string;
    engine?: string;
}

export type IdentifierStatOptions = ReturnType<typeof identifyModuleDataFile> & { filename: string };

async function identifier({ engine, language }: IdentifierCommandOptions = {}) {
    const spinner = ora({ color: 'cyan' });
    const [langError, options] = op(normalizeTranslateOptions, { engine, target: language });
    if (langError) {
        spinner.fail(langError.message);
        return;
    }

    const { translateEngine, translateTo } = options;

    const { path: modulePath, files } =
        (await choiceModuleDataFiles({ engine: translateEngine, to: translateTo })) ?? {};
    if (!modulePath || !files) return;
    const moduleDataPath = `${modulePath}\\ModuleData`;

    let currentIndex = 0;
    const spinnerMessage = $t('CMD_IDENTIFIER_WRITE_TRANSLATION_IDENTIFIER');
    const getSpinnerText = () => `${spinnerMessage} (${currentIndex++}/${files.length})`;

    const printDuration = useDurationPrint();
    spinner.start(getSpinnerText());

    const stats: IdentifierStatOptions[] = [];
    for (const file of files) {
        const items = getModuleDataItems(moduleDataPath, file);
        if (items.size === 0) continue;
        const countRecord = identifyModuleDataFile(moduleDataPath, file, items);
        stats.push({ filename: file, ...countRecord });
        spinner.text = getSpinnerText();
    }

    spinner.succeed(getSpinnerText());

    const md = await renderModuleIdentifierStat(stats);
    console.log(md);
    printDuration();
}

export default identifier;
