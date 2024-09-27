import { search } from '@inquirer/prompts';
import type { NexusModsOption } from '../../api/index.js';
import locale from '../../locale/index.js';
import { ErrorCodes } from '../../shared/index.js';
import { ensure, fuzzySearch, to } from '../../utils/index.js';

async function getRemoteModuleSearch(modules: NexusModsOption[]): Promise<NexusModsOption> {
    const list = modules.map((item) => ({
        ...item,
        name: item.nativeName ? `${item.nativeName} [${item.name}]` : item.name,
        value: item.uuid,
        description: '',
    }));

    const [error, uuid] = await to<number>(
        search({
            message: locale.INQ_SEARCH_MATCHING,
            source(input: string | undefined) {
                if (!input) return list;

                return list.filter((item) => fuzzySearch(input.toLowerCase(), item.name.toLowerCase()));
            },
            pageSize: 10,
        }),
    );
    ensure(!error, error?.message ?? 'User actively cancels the operation', ErrorCodes.EOP_CANCEL);

    const result = modules.find((item) => item.uuid === uuid);
    ensure(result?.url, 'No matching url in NexusMod', ErrorCodes.ENOTFOUND_NEXUSMOD_URL);

    return result;
}

export default getRemoteModuleSearch;
