import { type TranslatableModule, translateModules } from '../../helper/index.js';

async function getTranslateModules<T extends TranslatableModule = TranslatableModule>(
    modules: T[],
    google = false,
): Promise<T[]> {
    return translateModules<T>(modules, { google });
}

export default getTranslateModules;
