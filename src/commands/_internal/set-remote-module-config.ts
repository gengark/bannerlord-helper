import fs from 'node:fs';
import { type NexusModsOption } from '../../api/index.js';
import { type ModuleInfo } from '../../helper/index.js';
import { ErrorCodes } from '../../shared/index.js';
import { ensure, to } from '../../utils/index.js';
import getFuzzyRemoteModules from './get-fuzzy-remote-modules.js';
import getRemoteModuleSearch from './get-remote-module-search.js';
import getTranslateModules from './get-translate-modules.js';

async function setRemoteModuleConfig(module: ModuleInfo, google = false) {
    const remoteModules = await getFuzzyRemoteModules(module);

    const translation = await getTranslateModules<NexusModsOption>(remoteModules, google);
    const [error, result] = await to(getRemoteModuleSearch(translation));
    ensure(!error && result, error?.message ?? 'User actively cancels the operation', ErrorCodes.EOP_CANCEL);

    fs.writeFileSync(`${module.path}\\bh-config.json`, JSON.stringify(result, null, 2));

    return result;
}

export default setRemoteModuleConfig;
