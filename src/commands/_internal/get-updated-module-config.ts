import type { NexusModsOption } from '../../api/index.js';
import type { ModuleInfo } from '../../helper/index.js';
import getNativeModuleConfig from './get-native-module-config.js';
import setRemoteModuleConfig from './set-remote-module-config.js';

export type CompositeModuleConfig = ModuleInfo & NexusModsOption;

async function getUpdatedModuleConfig(
    module: ModuleInfo,
    google = false,
    reset = false,
): Promise<CompositeModuleConfig> {
    const config = await (reset ? setRemoteModuleConfig(module, google) : getNativeModuleConfig(module, google));

    return { ...config, ...module };
}

export default getUpdatedModuleConfig;
