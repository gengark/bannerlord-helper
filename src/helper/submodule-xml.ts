import path from 'node:path';
import type { Arrayable } from '../utils';
import ModuleXml, { type LiteralBoolean, type ValueAttributeTag, type XmlStandardOptions } from './module-xml';

export type ModuleCategory = 'Singleplayer' | 'Multiplayer';

export type ModuleType = 'Official' | 'Community';

export interface DependedModuleOptions {
    '@_Id': string;
    '@_DependentVersion'?: string;
    '@_Optional'?: LiteralBoolean;
}

interface SubModuleTagOptions extends ValueAttributeTag {
    '@_key': string;
}

interface SubModuleOptions {
    Name: ValueAttributeTag;
    DLLName?: ValueAttributeTag;
    Assemblies?: { Assembly: ValueAttributeTag } | '';
    SubModuleClassType?: ValueAttributeTag;
    Tags?: { Tag: Arrayable<SubModuleTagOptions> } | '';
}

interface XmlNodeNameOptions {
    '@_id': string;
    '@_path': string;
}

interface XmlNodeOptions {
    XmlName?: XmlNodeNameOptions;
    IncludedGameTypes?: { GameType?: Arrayable<ValueAttributeTag> } | '';
}

export interface SubmoduleXmlOptions extends XmlStandardOptions {
    Module: {
        Name: ValueAttributeTag;
        Id: ValueAttributeTag;
        Version: ValueAttributeTag;
        DefaultModule?: ValueAttributeTag<LiteralBoolean>;
        Official?: ValueAttributeTag<LiteralBoolean>;
        ModuleCategory?: ValueAttributeTag<ModuleCategory>;
        SingleplayerModule?: ValueAttributeTag<LiteralBoolean>;
        MultiplayerModule?: ValueAttributeTag<LiteralBoolean>;
        ModuleType?: ValueAttributeTag<ModuleType>;
        DependedModules?: { DependedModule: Arrayable<DependedModuleOptions> } | '';
        SubModules?: { SubModule: Arrayable<SubModuleOptions> } | '';
        Xmls?: { XmlNode: Arrayable<XmlNodeOptions> } | '';
    };
}

class SubmoduleXml extends ModuleXml<SubmoduleXmlOptions> {
    resolve(directoryPath: string) {
        return path.resolve(directoryPath, 'SubModule.xml');
    }

    create(options: { name: string; id: string; version: string; isMultiplayer?: boolean }): SubmoduleXmlOptions {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        return { ...this.createHeader(), Module: this.createModuleInfo(options) };
    }

    read(directoryPath: string) {
        return super.read(this.resolve(directoryPath));
    }

    write(directoryPath: string, data: SubmoduleXmlOptions) {
        return super.write(this.resolve(directoryPath), data);
    }

    protected createModuleInfo(options: {
        name: string;
        id: string;
        version: string;
        isMultiplayer?: boolean;
        dependencies?: Array<{ id: string; version: string; optional?: boolean }>;
    }): Pick<
        SubmoduleXmlOptions['Module'],
        | 'Name'
        | 'Id'
        | 'Version'
        | 'DefaultModule'
        | 'ModuleCategory'
        | 'ModuleType'
        | 'DependedModules'
        | 'SubModules'
        | 'Xmls'
    > {
        /* eslint-disable @typescript-eslint/naming-convention */
        return {
            Name: this.createValueAttributeTag(options.name),
            Id: this.createValueAttributeTag(options.id),
            Version: this.createValueAttributeTag(options.version),
            DefaultModule: this.createValueAttributeTag<LiteralBoolean>('false'),
            ModuleCategory: this.createValueAttributeTag<ModuleCategory>(
                options.isMultiplayer ? 'Multiplayer' : 'Singleplayer',
            ),
            ModuleType: this.createValueAttributeTag<ModuleType>('Community'),
            DependedModules: this.createModuleDependencies(options.dependencies),
            SubModules: this.createModuleSubModules(),
            Xmls: this.createModuleXmls(),
        };
        /* eslint-enable @typescript-eslint/naming-convention */
    }

    protected createModuleDependencies(dependencies?: Array<{ id: string; version: string; optional?: boolean }>) {
        return this.createArrayableTag<
            'DependedModule',
            { id: string; version: string; optional?: boolean },
            DependedModuleOptions
        >(
            'DependedModule',
            dependencies,
            /* eslint-disable @typescript-eslint/naming-convention */
            (item): DependedModuleOptions => ({
                '@_Id': item.id,
                '@_DependentVersion': item.version,
                '@_Optional': `${Boolean(item.optional)}`,
            }),
            /* eslint-enable @typescript-eslint/naming-convention */
        );
    }

    protected createModuleSubModules() {
        return '' as const;
    }

    protected createModuleXmls() {
        return '' as const;
    }
}

export default SubmoduleXml;
