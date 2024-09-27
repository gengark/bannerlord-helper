import { search } from '@inquirer/prompts';
import type { ModuleInfo } from '../../helper/index.js';
import locale from '../../locale/index.js';
import { ErrorCodes } from '../../shared/index.js';
import { ensure, fuzzySearch, to } from '../../utils/index.js';

async function getNativeModuleSearch(modules: ModuleInfo[]): Promise<ModuleInfo> {
    const getModuleDescription = (option: ModuleInfo) => {
        const tags = [
            option.builtin ? '<Built-in>' : '<Community>',
            option.multiplayer ? '<Multiplayer>' : '<Singleplayer>',
        ];

        const descriptions = [
            '---',
            `Directory: ${option.dir} | ${option.version}`,
            tags.join(' '),
            `REMOTE UPDATE: ${option.createTime}`,
            `DOWNLOAD TIME: ${option.downloadTime}`,
            `LATEST MODIFY: ${option.modifyTime}`,
        ];

        return descriptions.join(`\n`);
    };

    const list = modules.map((item) => ({
        ...item,
        name: item.nativeName ? `${item.nativeName} [${item.name}]` : item.name,
        value: item.id,
        description: getModuleDescription(item),
    }));

    const [error, module] = await to(
        search({
            message: locale.INQ_SEARCH_MOD,
            source(input: string | undefined) {
                if (!input) return list;

                return list.filter((item) => fuzzySearch(input.toLowerCase(), item.name.toLowerCase()));
            },
            pageSize: 10,
        }),
    );
    ensure(!error, error?.message ?? 'User actively cancels the operation', ErrorCodes.EOP_CANCEL);

    const result = modules.find((item) => item.id === module);
    ensure(result, 'No matching module', ErrorCodes.ENOENT_NATIVE_MOD);
    return result;
}

export default getNativeModuleSearch;
