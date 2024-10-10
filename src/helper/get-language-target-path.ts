import path from 'node:path';

function getLanguageTargetPath(moduleDataPath: string, code?: string, filename?: string) {
    const pathList: string[] = [moduleDataPath, 'Languages'];
    if (code && code !== 'EN') pathList.push(code);
    if (filename) pathList.push(filename);

    return path.resolve(...pathList);
}

export default getLanguageTargetPath;
