import { getModules } from '../../helper/index.js';
import { ErrorCodes } from '../../shared/index.js';
import { ensure } from '../../utils/index.js';

async function getNativeModules(keywords?: string) {
    const modules = await getModules(keywords);
    ensure(modules.length, 'No matching module', ErrorCodes.ENOENT_NATIVE_MOD);

    return modules;
}

export default getNativeModules;
