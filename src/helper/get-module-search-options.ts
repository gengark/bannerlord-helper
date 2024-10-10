import { translate, type TranslateOptions } from '../api';
import type { Awaitable } from '../utils';

interface GetModuleSearchOptions<T> {
    getter: (input: string) => Awaitable<T[]>;
    createName?: (item: T & { nativeName: string }) => string;
    createDescribe?: (item: T & { nativeName: string }) => string;
    createDisabled?: (item: T & { nativeName: string }) => boolean | string;
    createShorten?: (item: T & { nativeName: string }) => string;
    engine?: TranslateOptions['engine'];
    to?: TranslateOptions['to'];
}

interface BasicModuleInfo {
    id: string | number;
    name: string;
}

export interface ModuleInquireChoice {
    value: string;
    name: string;
    description?: string;
    short?: string;
    disabled?: boolean | string;
}

async function getModuleSearchOptions<T extends BasicModuleInfo>(
    input: string,
    options: GetModuleSearchOptions<T>,
): Promise<ModuleInquireChoice[]> {
    const keywords =
        input && options.engine && options.to
            ? await translate(input, { engine: options.engine, from: options.to, to: 'en' })
            : input;
    const mods = await options.getter(keywords);
    const names = mods.map((item: T) => item.name);
    const nameTranslations =
        options.engine && options.to && names.length > 0
            ? await translate(names, { engine: options.engine, from: 'en', to: options.to })
            : [];

    return mods.map((item: T, index) => {
        const scoped = { ...item, nativeName: nameTranslations[index] };
        return {
            value: JSON.stringify(scoped),
            name: options.createName?.(scoped) ?? item.name,
            short: options.createShorten?.(scoped) ?? item.name,
            description: options.createDescribe?.(scoped) ?? '',
            disabled: options.createDisabled?.(scoped) ?? false,
        };
    });
}

export default getModuleSearchOptions;
