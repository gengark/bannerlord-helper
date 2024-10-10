import ora from 'ora';
import { getModuleDataFiles, type NativeModuleOptions } from '../helper';
import { $t } from '../shared';
import searchNativeModules, { type SearchNativeModulesOptions } from './search-native-modules';

async function choiceModuleDataFiles({ engine, to }: SearchNativeModulesOptions) {
    const module: (NativeModuleOptions & { nativeName: string }) | undefined = await searchNativeModules({
        engine,
        to,
    });
    if (!module) return;

    const { path } = module;
    const moduleDataPath = `${path}\\ModuleData`;

    const spinner = ora({ color: 'cyan' }).start($t('CMD_IDENTIFIER_SEARCH_FOR_TRANSLATABLE_FILES'));
    const files = getModuleDataFiles(moduleDataPath);
    if (files.length === 0) {
        spinner.fail($t('CMD_IDENTIFIER_NO_TRANSLATABLE_FILE'));
        return;
    }

    spinner.stop();

    return { ...module, files };
}

export default choiceModuleDataFiles;
