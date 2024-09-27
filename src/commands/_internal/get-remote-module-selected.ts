import { select } from '@inquirer/prompts';
import type { NexusModsOption } from '../../api/index.js';
import locale from '../../locale/index.js';
import { ErrorCodes } from '../../shared/index.js';
import { ensure, to } from '../../utils/index.js';

async function getRemoteModuleSelected(modules: NexusModsOption[]): Promise<NexusModsOption> {
    const list = modules.map((item) => ({
        ...item,
        name: item.nativeName ? `${item.nativeName} [${item.name}]` : item.name,
        value: item.uuid,
        description: '',
    }));

    const [error, id] = await to(
        select({
            message: locale.INQ_SELECT_MSG,
            choices: list,
            pageSize: 10,
            loop: false,
        }),
    );
    ensure(!error, error?.message ?? 'User actively cancels the operation', ErrorCodes.EOP_CANCEL);

    const result = modules.find((item) => item.uuid === id);
    ensure(result?.url, 'No matching url in NexusMod', ErrorCodes.ENOTFOUND_NEXUSMOD_URL);

    return result;
}

export default getRemoteModuleSelected;
