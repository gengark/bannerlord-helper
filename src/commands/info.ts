import merge from 'lodash.merge';
import ora from 'ora';
import { nexusmodApi } from '../api';
import { renderModuleDetail } from '../components';
import { getCliConfig, normalizeTranslateOptions, searchNativeModules } from '../core';
import type { NativeModuleOptions } from '../helper';
import { useDurationPrint } from '../hooks';
import { $t } from '../shared';
import { op } from '../utils';

export interface InfoCommandOptions {
    language?: string;
    engine?: string;
    reset?: boolean;
}

async function info({ language, engine, reset }: InfoCommandOptions = {}) {
    const spinner = ora({ color: 'cyan' });
    const [langError, options] = op(normalizeTranslateOptions, { engine, target: language });
    if (langError) {
        spinner.fail(langError.message);
        return;
    }

    const { translateEngine, translateTo } = options;

    const module: (NativeModuleOptions & { nativeName: string }) | undefined = await searchNativeModules({
        engine: translateEngine,
        to: translateTo,
    });
    if (!module) return;

    const newestConfig = await getCliConfig({
        directoryPath: module.path,
        engine: translateEngine,
        to: translateTo,
        reset,
    });

    if (!newestConfig?.id) {
        spinner.fail($t('CMD_INFO_NO_MODULE_ID_OBTAINED'));
        return;
    }

    const printDuration = useDurationPrint();
    spinner.start($t('CMD_SEARCH_QUERY_MODULE_INFORMATION'));
    const remoteModule = await nexusmodApi.getModulePage(newestConfig.id);
    spinner.stop();

    const compositeInfo = merge(module, remoteModule, { engine: translateEngine, target: translateTo });
    const md = await renderModuleDetail(compositeInfo);
    console.log(md);
    printDuration();
}

export default info;
