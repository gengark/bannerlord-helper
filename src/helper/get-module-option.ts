import fs from 'node:fs';
import { XMLParser } from 'fast-xml-parser';
import { ErrorCodes } from '../shared/index.js';
import { ensure, run } from '../utils/index.js';

export interface ModuleOption {
    id?: string;
    name?: string;
    version?: string;
    builtin?: boolean;
    multiplayer?: boolean;
    dependencies?: Array<{ id?: string; version?: string }>;
}

interface ValueXmlOption {
    '@_value': string;
}

interface DependedModulesXmlOption {
    '@_Id': string;
    '@_DependentVersion': string;
}

interface ModuleXmlOption {
    Id: ValueXmlOption;
    Name: ValueXmlOption;
    Version: ValueXmlOption;
    DependedModules: { DependedModule: DependedModulesXmlOption | DependedModulesXmlOption[] };
    DefaultModule?: ValueXmlOption;
    ModuleCategory?: ValueXmlOption;
    SingleplayerModule?: ValueXmlOption;
    MultiplayerModule?: ValueXmlOption;
}

const xml = new XMLParser({ ignoreAttributes: false });

const valueAdapter = (option?: ValueXmlOption) => option?.['@_value'];
const booleanAdapter = (option?: ValueXmlOption) => option?.['@_value'] === 'true';
const dependencyAdapter = (dep?: DependedModulesXmlOption) => ({
    id: dep?.['@_Id'],
    version: dep?.['@_DependentVersion'],
});

function getModuleOption(filepath: string): ModuleOption {
    const isExists = fs.existsSync(filepath);
    ensure(isExists, `Module is missing configuration file`, ErrorCodes.ENOENT_MOD_CONFIG);

    const content = fs.readFileSync(filepath, 'utf8');
    const [error, result] = run(xml.parse.bind(xml, content));
    ensure(!error, error?.message ?? 'XML file deserialization failed', ErrorCodes.EINVAL_MOD_CONFIG);

    const module_ = result?.Module as ModuleXmlOption;
    const id = valueAdapter(module_.Id);
    const name = valueAdapter(module_.Name);
    const version = valueAdapter(module_.Version)?.replace(/^[ve]\.?/, '');
    const builtin = booleanAdapter(module_.DefaultModule);
    const multiplayer =
        booleanAdapter(module_.MultiplayerModule) ||
        (!booleanAdapter(module_.SingleplayerModule) && valueAdapter(module_.ModuleCategory) === 'Multiplayer');
    const dependencies = module_?.DependedModules?.DependedModule
        ? Array.isArray(module_.DependedModules.DependedModule)
            ? module_.DependedModules.DependedModule.map(dependencyAdapter)
            : [dependencyAdapter(module_.DependedModules.DependedModule)]
        : [];

    return { id, name, version, builtin, multiplayer, dependencies };
}

export default getModuleOption;
