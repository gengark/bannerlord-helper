import { XML_CONFIGURATION } from '../constants';
import { readdirFiles } from '../utils';

function getModuleDataFiles(directoryPath: string) {
    if (!directoryPath) return [];

    const { ENABLED_FILE_EXTENSIONS: enabledExtensions } = XML_CONFIGURATION;
    return readdirFiles(directoryPath, { extensions: enabledExtensions });
}

export default getModuleDataFiles;
