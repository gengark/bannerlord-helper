import inquire from '@inquirer/search';
import ora from 'ora';
import { nexusmodApi, type NexusmodModuleOptions, type TranslateOptions } from '../api';
import { $t } from '../shared';
import { delay, fuzzySearch, to } from '../utils';
import getModuleSearchOptions, { type ModuleInquireChoice } from '../helper/get-module-search-options';

export interface SearchNexusmodModulesOptions {
    keywords?: string;
    engine: TranslateOptions['engine'];
    to?: TranslateOptions['to'];
}

async function getModuleOptions(
    input: string,
    options: Omit<SearchNexusmodModulesOptions, 'keywords'>,
): Promise<ModuleInquireChoice[]> {
    return getModuleSearchOptions<NexusmodModuleOptions>(input, {
        ...options,
        getter: nexusmodApi.getModules,
        createName: (item) => (item.nativeName ? `${item.nativeName} [${item.name}]` : item.name),
        createDescribe: (item) =>
            `${
                item.isAdult ? '[NSFW] ' : ''
            }ID: ${item.id} | ${$t('AUTHOR')}: ${item.author.name} | ${$t('ENDORSEMENT')}: ${item.endorsements} | ${$t(
                'DOWNLOAD',
            )}: ${item.downloads}\n${$t('URL')}: ${item.url}\n${$t('THUMBNAIL')}: ${item.thumbnail}`,
    });
}

function createDynamicSourceGetter(options: Omit<SearchNexusmodModulesOptions, 'keywords'>) {
    return async (input: string | undefined, { signal }: { signal: AbortSignal }) => {
        await delay(600);
        if (signal.aborted || !input) {
            return [];
        }

        return getModuleOptions(input, options);
    };
}

function createStaticSourceGetter(list: ModuleInquireChoice[]) {
    return async (input: string | undefined) => {
        return input ? list.filter((item) => fuzzySearch(input, item.name)) : list;
    };
}

async function searchNexusmodModules({ keywords, engine, to: target }: SearchNexusmodModulesOptions) {
    const presetModules: ModuleInquireChoice[] = [];

    const spinner = ora({ color: 'cyan' });
    if (keywords) {
        spinner.start($t('CMD_SEARCH_SEARCH_MODULES_ON_NEXUSMOD'));
        const [error, list] = await to(getModuleOptions(keywords, { engine, to: target }));
        if (error) {
            spinner.fail(error?.message);
            return;
        }

        if (list.length === 0) {
            spinner.fail($t('CMD_SEARCH_NO_MATCHING_MODULE_FOUND', { keywords }));
            return;
        }

        presetModules.push(...list);
        spinner.stop();
    }

    const [error, serializedInfo] = await to(
        inquire({
            message: `${$t('CMD_SEARCH_SELECT_MODULE_FROM_NEXUSMOD')} (${$t('TIP_SIGINT')})`,
            pageSize: 10,
            source:
                presetModules.length > 0
                    ? createStaticSourceGetter(presetModules)
                    : createDynamicSourceGetter({ engine, to: target }),
        }),
    );
    if (error) return;

    return JSON.parse(serializedInfo) as NexusmodModuleOptions & { nativeName: string };
}

export default searchNexusmodModules;
