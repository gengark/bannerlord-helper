import fs from 'node:fs';
import { $t } from '../shared';
import { ensure, formatDate, isPlainObject, op } from '../utils';
import getModuleDirectory from './get-module-directory';
import { type LiteralBoolean, type ValueAttributeTag } from './module-xml';
import SubmoduleXml, {
    type DependedModuleOptions,
    type ModuleCategory,
    type ModuleType,
    type SubmoduleXmlOptions,
} from './submodule-xml';

export interface NativeModuleOptions {
    id: string;
    name: string;
    version?: string;
    builtin: boolean;
    type: ModuleType;
    category: ModuleCategory;
    dependencies: Array<{ id: string; version?: string; optional: boolean }>;
    directory: string;
    path: string;
    downloadTime?: string;
    modifyTime?: string;
    updatedTime?: string;
}

const valueAdapter = <T extends string = string>(option?: ValueAttributeTag<T>) => option?.['@_value'];
const booleanAdapter = (option?: ValueAttributeTag<LiteralBoolean>) => option?.['@_value'] === 'true';
const dependencyAdapter = (dep?: SubmoduleXmlOptions['Module']['DependedModules']) => {
    if (typeof dep === 'string' || !dep?.DependedModule) return [];

    const remapping = (item: DependedModuleOptions) => ({
        id: item['@_Id'],
        version: item['@_DependentVersion'],
        optional: Boolean(item['@_Optional']),
    });
    if (isPlainObject<DependedModuleOptions>(dep.DependedModule)) return [remapping(dep.DependedModule)];

    return dep.DependedModule.map((item) => remapping(item));
};

function getNativeModuleOptions(directory: fs.Dirent, instance: SubmoduleXml): NativeModuleOptions | undefined {
    if (!directory.isDirectory()) return;

    const currentName = directory.name;
    const currentPath = `${directory.parentPath ?? directory.path}\\${currentName}`;
    const [accessError] = op(instance.check.bind(instance), currentPath);
    if (accessError) return;

    const [directoryStatError, directoryInfo] = op(fs.statSync, currentPath);
    const [fileStatError, fileInfo] = op(fs.statSync, instance.resolve(currentPath));
    if (directoryStatError ?? fileStatError) return;
    const { birthtime: downloadTime, mtime: modifyTime } = directoryInfo ?? {};
    const { mtime: updatedTime } = fileInfo ?? {};

    const [readError, data] = op(instance.read.bind(instance), currentPath);
    const config = data?.Module;
    if (readError ?? !config) return;

    const id = valueAdapter(config.Id);
    return {
        id: id ?? currentName,
        name: valueAdapter(config.Name) ?? id ?? currentName,
        version: valueAdapter(config.Version)?.replace(/^[ve]\.?/, ''),
        builtin: booleanAdapter(config.DefaultModule),
        type: valueAdapter(config.ModuleType) ?? (booleanAdapter(config.Official) ? 'Official' : 'Community'),
        category:
            valueAdapter(config.ModuleCategory) ??
            (booleanAdapter(config.MultiplayerModule) ? 'Multiplayer' : 'Singleplayer'),
        dependencies: dependencyAdapter(config.DependedModules),
        directory: currentName,
        path: currentPath,
        downloadTime: downloadTime ? formatDate(downloadTime) : undefined,
        modifyTime: modifyTime ? formatDate(modifyTime) : undefined,
        updatedTime: updatedTime ? formatDate(updatedTime) : undefined,
    };
}

async function getNativeModules(): Promise<NativeModuleOptions[]> {
    const directoryPath = await getModuleDirectory();
    const directories = fs.readdirSync(directoryPath, { withFileTypes: true });
    ensure(directories.length, $t('ENOENT_DIRECTORY_EMPTY', { path: directoryPath }), 'ENOENT_NATIVE_MOD_EMPTY');

    const instance = new SubmoduleXml();
    const modules: NativeModuleOptions[] = [];
    for (const directory of directories) {
        const options = getNativeModuleOptions(directory, instance);
        if (options) modules.push(options);
    }

    ensure(modules.length, $t('ENOENT_DIRECTORY_EMPTY', { path: directoryPath }), 'ENOENT_DIRECTORY_EMPTY');
    return modules;
}

export default getNativeModules;
