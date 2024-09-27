import { get } from '../api/index.js';
import { ErrorCodes } from '../shared/index.js';
import { ensure, to } from '../utils/index.js';

async function getRemotePage(url: string) {
    const [error, html] = await to<string>(get(url, {}, {}, 'text'));
    ensure(!error, error?.message ?? 'Can not read html from NexusMod', ErrorCodes.ECONNREFUSED_REMOTE_PAGE);

    return html;
}

export default getRemotePage;
