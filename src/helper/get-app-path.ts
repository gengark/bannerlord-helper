import { getApps, type SteamAppOption } from '@kabeep/node-steam-library';
import { ErrorCodes } from '../shared/index.js';
import { ensure, to } from '../utils/index.js';

async function getAppPath() {
    const [error, apps] = await to<SteamAppOption[]>(getApps());
    ensure(!error, error?.message ?? 'The `getApps` api call of node-steam-library failed', ErrorCodes.EACCES_STEAM);

    const { installPath } =
        apps.find((item) => {
            return `${item.id}` === '261550' || item.name === 'Mount & Blade II: Bannerlord';
        }) ?? {};
    ensure(installPath, '`Mount & Blade II: Bannerlord` directory not found', ErrorCodes.ENOENT_APP);

    return installPath;
}

export default getAppPath;
