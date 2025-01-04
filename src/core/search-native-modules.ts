import inquire from '@inquirer/search';
import ora from 'ora';
import type { TranslateOptions } from '../api';
import { getModuleSearchOptions, getNativeModules, type NativeModuleOptions } from '../helper';
import { $t } from '../shared';
import { fuzzySearch, to } from '../utils';

export interface SearchNativeModulesOptions {
    engine: TranslateOptions['engine'];
    to?: TranslateOptions['to'];
}

async function searchNativeModules({ engine, to: target }: SearchNativeModulesOptions) {
    const spinner = ora({ color: 'cyan' }).start($t('CMD_INFO_SEARCH_MODULE_ON_NATIVE'));
    const [pathError, modules] = await to(getNativeModules());
    if (pathError) {
        spinner.fail(pathError.message);
        return;
    }

    const [error, options] = await to(
        getModuleSearchOptions<NativeModuleOptions>('', {
            engine,
            to: target,
            getter: () => modules,
            createName: (item) => (item.nativeName ? `${item.nativeName} [${item.name}]` : item.name),
            createShorten: (item) => item.directory,
            createDescribe: (item) =>
                `ID: ${item.id} | ${$t('DIRECTORY')}: ${item.directory} | ${$t('VERSION')}: ${item.version}\n${
                    item.builtin ? $t('BUILTIN_MODULE') : $t('EXTERNAL_MODULE')
                } | ${item.type === 'Official' ? $t('OFFICIAL_MODULE') : $t('COMMUNITY_MODULE')} | ${
                    item.category === 'Multiplayer' ? $t('MULTIPLAYER_MODULE') : $t('SINGLEPLAYER_MODULE')
                }\n${$t('DOWNLOAD_TIME')}: ${item.downloadTime} | ${$t('MODIFY_TIME')}: ${item.modifyTime} | ${$t(
                    'UPDATED_TIME',
                )}: ${item.updatedTime}\n${$t('DEPENDENCIES')}: [${item.dependencies
                    .map((item) => `${item.optional ? '*' : ''}${item.id}${item.version ? `@${item.version}` : ''}`)
                    .join('] [')}]`,
        }),
    );
    if (error) {
        spinner.fail(error?.message);
        return;
    }

    spinner.stop();
    const [opError, serializedInfo] = await to(
        inquire({
            message: `${$t('CMD_INFO_SELECT_MODULE_FROM_NATIVE')} (${$t('TIP_SIGINT')})`,
            pageSize: 10,
            source(input, { signal }) {
                if (signal.aborted || !input) {
                    return options;
                }

                return options.filter((item) => fuzzySearch(input.toLowerCase(), item.name.toLowerCase()));
            },
        }),
    );
    if (opError) return;

    return JSON.parse(serializedInfo) as NativeModuleOptions & { nativeName: string };
}

export default searchNativeModules;
