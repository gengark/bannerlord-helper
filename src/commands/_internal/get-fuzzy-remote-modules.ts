import uniqBy from 'lodash.uniqby';
import words from 'lodash.words';
import type { NexusModsOption } from '../../api/index.js';
import { getRemoteModule, type ModuleInfo } from '../../helper/index.js';
import { ErrorCodes } from '../../shared/index.js';
import { ensure } from '../../utils/index.js';

async function getFuzzyRemoteModules(module: ModuleInfo) {
    const nameTerms: string[] = words(module.name)
        .filter((word) => word.length > 2)
        .slice(0, 3);
    const idTerms: string[] = words(module.id)
        .filter((word) => word.length > 2)
        .slice(0, 3);

    const nameRemoteModules: NexusModsOption[] = await getRemoteModule(nameTerms.join(' '));
    const idRemoteModules: NexusModsOption[] = await getRemoteModule(idTerms.join(' '));
    const remoteModules: NexusModsOption[] = [...nameRemoteModules.slice(0, 5), ...idRemoteModules.slice(0, 5)];

    for (const word of [...nameTerms, ...idTerms]) {
        const result: NexusModsOption[] = await getRemoteModule(word);
        remoteModules.push(...result);
    }

    ensure(remoteModules.length, 'No matching module found in NexusMod', ErrorCodes.ENOENT_REMOTE_MOD);
    return uniqBy(remoteModules, 'uuid');
}

export default getFuzzyRemoteModules;
