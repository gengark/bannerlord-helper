import fs from 'node:fs';
import path from 'node:path';
import { getApps, type SteamAppOption } from '@kabeep/node-steam-library';
import { $t } from '../shared';
import { ensure, to } from '../utils';

async function getModuleDirectory() {
    const [error, apps] = await to<SteamAppOption[]>(getApps());
    ensure(!error, error?.message, 'EACCES_STEAM');

    const { installPath } =
        apps.find((item) => {
            return `${item.id}` === '261550' || item.name === 'Mount & Blade II: Bannerlord';
        }) ?? {};
    ensure(installPath, $t('ENOENT_MODULE_DIRECTORY', { path: 'Mount & Blade II: Bannerlord' }), 'ENOENT_APP');

    const modulePath = path.resolve(installPath, 'Modules');
    const isExists = fs.existsSync(modulePath);
    ensure(isExists, $t('ENOENT_MODULE_DIRECTORY', { path: modulePath }), 'ENOENT_MOD_DIR');

    return modulePath;
}

export default getModuleDirectory;
