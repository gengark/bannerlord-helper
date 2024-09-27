import open from 'open';
import { type NexusModsOption } from '../api/index.js';
import { ErrorCodes } from '../shared/index.js';
import { ensure, to } from '../utils/index.js';

async function browserRemotePage(module: NexusModsOption) {
    const [error] = await to(open(module.url));
    ensure(!error, error?.message ?? 'Can not open url', ErrorCodes.EACCES_BROWSER);
}

export default browserRemotePage;
