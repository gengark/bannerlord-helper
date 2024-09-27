import words from 'lodash.words';
import { translateApi, type FlexibleTranslateOptions } from '../api/index.js';
import { to } from '../utils/index.js';

export interface TranslatableModule {
    [key: string]: any;
    name: string;
}

async function translateModules<T extends TranslatableModule = TranslatableModule>(
    modules: T[],
    options?: FlexibleTranslateOptions,
): Promise<T[]> {
    const moduleNames = modules.map((item) => words(item.name).join(' '));

    const [error, translations] = await to(translateApi.batch(moduleNames, options));
    if (error) {
        return modules;
    }

    return modules.map((item) => ({ ...item, nativeName: translations.shift() || '' }));
}

export default translateModules;
