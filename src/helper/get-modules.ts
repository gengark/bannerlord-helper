import fs from 'node:fs';
import path from 'node:path';
import { ErrorCodes } from '../shared/index.js';
import { ensure, formatDate, fuzzySearch, run } from '../utils/index.js';
import getModulePath from './get-module-path.js';
import { getModuleOption, type ModuleOption } from './index.js';

export type ModuleInfo = ModuleOption & {
    id: string;
    name: string;
    nativeName: string;
    dir: string;
    path: string;
    downloadTime: string;
    modifyTime: string;
    createTime: string;
};

async function getModules(keywords?: string): Promise<ModuleInfo[]> {
    const basePath = await getModulePath();

    const moduleDirectories = fs.readdirSync(basePath);
    ensure(moduleDirectories.length, 'The module directory is empty', ErrorCodes.ENOENT_NATIVE_MOD_EMPTY);

    const modules: ModuleInfo[] = moduleDirectories.reduce(
        (accumulator: ModuleInfo[], current: string): ModuleInfo[] => {
            const directoryPath = path.resolve(basePath, current);
            const filepath = path.resolve(directoryPath, 'SubModule.xml');
            const directoryInfo = fs.statSync(directoryPath);
            const fileInfo = fs.statSync(filepath);

            const [error, option] = run(getModuleOption, filepath);

            return error
                ? accumulator
                : [
                      ...accumulator,
                      {
                          ...option,
                          id: option.id ?? current,
                          name: option.name ?? option.id ?? current,
                          nativeName: '',
                          dir: current,
                          path: directoryPath,
                          downloadTime: formatDate(directoryInfo.birthtime),
                          modifyTime: formatDate(directoryInfo.mtime),
                          createTime: formatDate(fileInfo.mtime),
                      },
                  ];
        },
        [],
    );
    ensure(modules.length, 'The module directory is empty', ErrorCodes.ENOENT_NATIVE_MOD_EMPTY);

    return keywords ? modules.filter((item) => fuzzySearch(keywords.toLowerCase(), item.name.toLowerCase())) : modules;
}

export default getModules;
