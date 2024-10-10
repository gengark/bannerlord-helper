import cloneDeep from 'lodash.clonedeep';
import get from 'lodash.get';
import set from 'lodash.set';
import { type NativeModuleOptions, SubmoduleXml } from '../helper';

function writeExternalSubmoduleFile(
    modulePath: string,
    targetModulePath: string,
    moduleOptions: NativeModuleOptions & { nativeName: string },
    translateTo: string,
): void {
    const { id, name, version, dependencies } = moduleOptions;

    const instance = new SubmoduleXml();
    const sourceModule = instance.read(modulePath);
    const sourceModuleId = get(sourceModule, 'Module.Id.@_value', id);
    const sourceModuleName = get(sourceModule, 'Module.Name.@_value', name);
    const sourceModuleVersion = get(sourceModule, 'Module.Version.@_value', version);
    const originalSourceModuleDependencies = get(sourceModule, 'Module.DependedModules.DependedModule', dependencies);
    const sourceModuleDependencies = Array.isArray(originalSourceModuleDependencies)
        ? originalSourceModuleDependencies
        : [originalSourceModuleDependencies];

    const translationModule = cloneDeep(sourceModule);
    set(translationModule, 'Module.Name.@_value', `${sourceModuleName} ${translateTo}`);
    set(translationModule, 'Module.Id.@_value', `${sourceModuleId}_${translateTo}`);
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const targetDependency = { '@_Id': sourceModuleId, '@_DependentVersion': sourceModuleVersion, '@_Optional': true };
    set(
        translationModule,
        'Module.DependedModules.DependedModule',
        sourceModuleDependencies.length > 0 ? [...sourceModuleDependencies, targetDependency] : targetDependency,
    );
    instance.write(targetModulePath, translationModule);
}

export default writeExternalSubmoduleFile;
