import type { NexusModsOption } from '../../api/index.js';
import { getRemoteModule } from '../../helper/index.js';
import { ErrorCodes } from '../../shared/index.js';
import { ensure } from '../../utils/index.js';

async function getRemoteModules(query: string): Promise<NexusModsOption[]> {
    const modules = await getRemoteModule(query);
    ensure(modules.length, 'No matching module found in NexusMod', ErrorCodes.ENOENT_REMOTE_MOD);
    return modules;
}

export default getRemoteModules;
