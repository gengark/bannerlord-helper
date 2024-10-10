import fs from 'node:fs';
import { XML_CONFIGURATION } from '../constants';

function getModuleDataFiles(directoryPath: string) {
    if (!directoryPath) return [];

    const files = fs.readdirSync(directoryPath, { withFileTypes: true });
    const { ENABLED_FILE_EXTENSIONS: enabledExtensions } = XML_CONFIGURATION;

    const result: string[] = [];
    for (const file of files) {
        if (!file.name || !file.isFile?.()) continue;

        const fileExtension = file.name.split('.').pop();
        if (!fileExtension || !enabledExtensions.includes(fileExtension)) continue;

        result.push(file.name);
    }

    return result;
}

export default getModuleDataFiles;
