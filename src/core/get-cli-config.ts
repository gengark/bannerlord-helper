import type { NexusmodModuleOptions } from '../api';
import { BannerlordHelperConfig } from '../helper';
import { op } from '../utils';
import searchNexusmodModules, { type SearchNexusmodModulesOptions } from './search-nexusmod-modules';

async function initialBhConfig({
    engine,
    to: target,
    directoryPath,
    instance,
}: Pick<SearchNexusmodModulesOptions, 'engine' | 'to'> & {
    directoryPath: string;
    instance: BannerlordHelperConfig;
}): Promise<NexusmodModuleOptions | undefined> {
    const module = await searchNexusmodModules({ engine, to: target });
    if (!module) return;

    instance.write(directoryPath, module);
    return module;
}

async function getCliConfig({
    directoryPath,
    engine: translateEngine,
    to: translateTo,
    reset,
}: Pick<SearchNexusmodModulesOptions, 'engine' | 'to'> & {
    directoryPath: string;
    reset?: boolean;
}): Promise<NexusmodModuleOptions | undefined> {
    const instance = new BannerlordHelperConfig();
    if (reset) return initialBhConfig({ engine: translateEngine, to: translateTo, directoryPath, instance });

    const [error, config] = op<NexusmodModuleOptions, [string]>(instance.read.bind(instance), directoryPath);
    if (error ?? !config?.id)
        return initialBhConfig({ engine: translateEngine, to: translateTo, directoryPath, instance });

    return config;
}

export default getCliConfig;
