import fs from 'node:fs';
import type { NexusModsOption } from '../../api/index.js';
import type { ModuleInfo } from '../../helper/index.js';
import { run } from '../../utils/index.js';
import setRemoteModuleConfig from './set-remote-module-config.js';

async function getNativeModuleConfig(module: ModuleInfo, google = false): Promise<NexusModsOption> {
    const configPath = `${module.path}\\bh-config.json`;
    if (!fs.existsSync(configPath)) {
        return setRemoteModuleConfig(module, google);
    }

    const [_, result] = run<NexusModsOption>(JSON.parse, fs.readFileSync(configPath, 'utf8'));
    if (_) {
        return setRemoteModuleConfig(module, google);
    }

    return result;
}

export default getNativeModuleConfig;
