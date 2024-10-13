import ora from 'ora';
import { type ModuleTranslateStatOptions, renderModuleTranslateStat } from '../components';
import {
    choiceModuleTemplateFiles,
    normalizeTranslateOptions,
    searchNativeModules,
    writeLanguageDataFile,
    writeTranslationStringsFile,
} from '../core';
import {
    clearLanguagesDirectory,
    getLanguageTargetPath,
    getTranslationFilename,
    type NativeModuleOptions,
    restoreTranslationFilename,
} from '../helper';
import { useCountProgressMessage, useDurationPrint } from '../hooks';
import { $t } from '../shared';
import { ensureDirectory, op, pathExist, to } from '../utils';

export interface TranslateCommandOptions {
    to?: string;
    engine?: string;
    from?: string;
    prefix?: string;
    force?: boolean;
}

async function translate({ engine, to: target, from: source, prefix, force }: TranslateCommandOptions = {}) {
    const spinner = ora({ color: 'cyan' });
    if (!target) {
        spinner.fail($t('EINVAL_MISSING_TO'));
        return;
    }

    const [langError, options] = op(normalizeTranslateOptions, { engine, source, target });
    if (langError) {
        spinner.fail(langError.message);
        return;
    }

    const { translateEngine, translateFrom = 'EN', translateTo: originalTranslateTo } = options;
    const translateTo = originalTranslateTo!;

    const module: (NativeModuleOptions & { nativeName: string }) | undefined = await searchNativeModules({
        engine: translateEngine,
    });
    if (!module) return;

    const { path } = module;
    const moduleDataPath = `${path}\\ModuleData`;

    const sourcePath = getLanguageTargetPath(moduleDataPath, translateFrom);
    const [error, files] = await to(choiceModuleTemplateFiles(sourcePath, translateFrom));
    if (error) {
        spinner.fail(error.message);
        return;
    }

    const targetPath = getLanguageTargetPath(moduleDataPath, translateTo);
    ensureDirectory(targetPath);

    if (force) {
        const [error] = await to(clearLanguagesDirectory(targetPath, 'xml'));
        if (error) return;
    }

    const stats: ModuleTranslateStatOptions[] = [];
    const filenameDictionary = new Map<string, string>();

    const printDuration = useDurationPrint();
    const countIncrease = useCountProgressMessage(files?.length, $t('CMD_TRANSLATE_TRANSLATE_TEMPLATE_FILE'));
    spinner.start(countIncrease());

    for (const file of files) {
        const filename = getTranslationFilename(restoreTranslationFilename(file), translateTo);

        const isExisted = pathExist(`${sourcePath}\\${file}`);
        if (!isExisted) {
            stats.push({ filename, status: 404 });
            spinner.text = countIncrease();
            continue;
        }

        filenameDictionary.set(file, filename);

        const [error, stat] = await to<Omit<ModuleTranslateStatOptions, 'filename' | 'status'>>(
            writeTranslationStringsFile(`${sourcePath}\\${file}`, `${targetPath}\\${filename}`, {
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

    const standardFiles = files.map((item) => filenameDictionary.get(item)).filter(Boolean) as string[];
    writeLanguageDataFile(targetPath, translateTo, standardFiles);

    const md = await renderModuleTranslateStat(stats);
    console.log(md);
    printDuration();
}

export default translate;
