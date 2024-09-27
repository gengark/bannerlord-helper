import fs from 'node:fs';
import path from 'node:path';
import { ErrorCodes } from '../shared/index.js';
import { ensure } from '../utils/index.js';
import getAppPath from './get-app-path.js';

async function getModulePath() {
    const basePath = await getAppPath();

    const modulePath = path.resolve(basePath, 'Modules');
    const isExists = fs.existsSync(modulePath);
    ensure(isExists, 'Mod directory does not exist', ErrorCodes.ENOENT_MOD_DIR);

    return modulePath;
}

export default getModulePath;
