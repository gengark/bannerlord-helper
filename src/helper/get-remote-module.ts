import words from 'lodash.words';
import { nexusModsApi, type NexusModsOption } from '../api/index.js';
import { ErrorCodes } from '../shared/index.js';
import { ensure, to } from '../utils/index.js';

async function getRemoteModule(query?: string): Promise<NexusModsOption[]> {
    ensure(query, 'Please enter a query', ErrorCodes.EINVAL_MOD_QUERY);
    const keywords = words(query);
    const [error, modules] = await to<NexusModsOption[]>(nexusModsApi.search(keywords));
    ensure(!error, error?.message ?? 'Sending query request to Nexusmod failed', ErrorCodes.ECONNREFUSED_REMOTE_MOD);

    return modules;
}

export default getRemoteModule;
