import merge from 'lodash.merge';
import ora from 'ora';
import { nexusmodApi, type NexusmodModuleOptions } from '../api';
import { renderModulePage } from '../components';
import { normalizeTranslateOptions, searchNexusmodModules } from '../core';
import useDurationPrint from '../hooks/use-duration-print';
import { $t } from '../shared';
import { op } from '../utils';

export interface SearchCommandOptions {
    language?: string;
    keywords?: string;
    engine?: string;
}

async function search({ language, engine, keywords }: SearchCommandOptions = {}) {
    if (!keywords) return;
    const spinner = ora({ color: 'cyan' });
    const [langError, options] = op(normalizeTranslateOptions, { engine, target: language });
    if (langError) {
        spinner.fail(langError.message);
        return;
    }

    const { translateEngine, translateTo } = options;

    const module: (NexusmodModuleOptions & { nativeName: string }) | undefined = await searchNexusmodModules({
        keywords,
        engine: translateEngine,
        to: translateTo,
    });
    if (!module) return;

    const printDuration = useDurationPrint();
    spinner.start($t('CMD_SEARCH_QUERY_MODULE_INFORMATION'));
    const remoteModule = await nexusmodApi.getModulePage(module.id);
    spinner.stop();

    const compositeInfo = merge(module, remoteModule, { engine: translateEngine, target: translateTo });
    const md = await renderModulePage(compositeInfo);
    console.log(md);
    printDuration();
}

export default search;
