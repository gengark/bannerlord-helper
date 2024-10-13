import path from 'node:path';
import ora from 'ora';
import { type ModuleTranslateStatOptions, renderModuleTranslateStat } from '../components';
import {
    choiceModuleDataFiles,
    normalizeTranslateOptions,
    writeExternalSubmoduleFile,
    writeExternalTranslationFile,
} from '../core';
import { getModuleDataItems, type NativeModuleOptions } from '../helper';
import clearLanguagesDirectory from '../helper/clear-languages-directory';
import { useCountProgressMessage, useDurationPrint } from '../hooks';
import { $t } from '../shared';
import { ensureDirectory, op, to } from '../utils';

export interface ExternalCommandOptions {
    engine?: string;
    from?: string;
    to?: string;
    prefix?: string;
    force?: boolean;
}

async function external({ engine, from: source, to: target, prefix, force }: ExternalCommandOptions = {}) {
    const spinner = ora({ color: 'cyan' });
    if (!target) {
        spinner.fail($t('EINVAL_MISSING_TO'));
        return;
    }

    const [langError, options] = op(normalizeTranslateOptions, { engine, target, source });
    if (langError) {
        spinner.fail(langError.message ?? 'Unknown error');
        return;
    }

    const { translateEngine, translateFrom = 'EN', translateTo: originalTranslateTo } = options;
    const translateTo = originalTranslateTo!;

    const { files, ...restModuleOptions } =
        (await choiceModuleDataFiles({ engine: translateEngine })) ??
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        ({} as NativeModuleOptions & { nativeName: string; files: string[] });
    const { path: modulePath } = restModuleOptions;
    if (!modulePath || !files) return;

    const targetModulePath = path.resolve(modulePath, `../${path.basename(modulePath)} ${translateTo}`);
    ensureDirectory(targetModulePath);

    const [error] = op(writeExternalSubmoduleFile, modulePath, targetModulePath, restModuleOptions, translateTo);
    if (error) {
        spinner.fail($t('CMD_EXTERNAL_FAILED_TO_WRITE_SUBMODULE', { path: targetModulePath }));
        return;
    }

    const targetModuleDataPath = `${targetModulePath}\\ModuleData`;
    ensureDirectory(targetModuleDataPath);

    if (force) {
        const [error] = await to(clearLanguagesDirectory(targetModuleDataPath, 'xslt'));
        if (error) return;
    }

    const printDuration = useDurationPrint();
    const countIncrease = useCountProgressMessage(files.length, $t('CMD_TRANSLATE_TRANSLATE_TEMPLATE_FILE'));
    spinner.start(countIncrease());

    const stats: ModuleTranslateStatOptions[] = [];
    for (const file of files) {
        const items = getModuleDataItems(`${modulePath}\\ModuleData`, file);

        const filename = [...file.split('.').slice(0, -1), 'xslt'].join('.');
        const [error, stat] = await to<Omit<ModuleTranslateStatOptions, 'filename' | 'status'>>(
            writeExternalTranslationFile(`${targetModuleDataPath}\\${filename}`, items, {
                engine: translateEngine,
                to: translateTo,
                from: translateFrom,
                prefix,
            }),
        );

        stats.push(error ? { filename, status: 500 } : { filename, status: 200, ...stat });
        spinner.text = countIncrease();
    }

    spinner.succeed(countIncrease(true));

    const md = await renderModuleTranslateStat(stats);
    console.log(md);
    printDuration();
}

export default external;
