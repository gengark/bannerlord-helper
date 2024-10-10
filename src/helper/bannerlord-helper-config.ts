import fs from 'node:fs';
import path from 'node:path';
import type { NexusmodModuleOptions } from '../api';
import { $t } from '../shared';
import { ensure, type NodeError, op, readFile } from '../utils';

class BannerlordHelperConfig {
    resolve(directoryPath: string) {
        return path.resolve(directoryPath, 'bh-config.json');
    }

    check(filepath: string) {
        // eslint-disable-next-line no-bitwise
        const [error] = op<void, [string, number]>(fs.accessSync, filepath, fs.constants.R_OK | fs.constants.W_OK);
        ensure(!error, error?.message ?? $t('EACCES_FILE', { path: filepath }), (error as NodeError)?.code ?? 'EACCES');
        return true;
    }

    read(directoryPath: string) {
        const filepath = this.resolve(directoryPath);
        this.check(filepath);

        const content = readFile(filepath);
        const [error, data] = op<NexusmodModuleOptions>(JSON.parse, content);
        ensure(!error, error?.message ?? $t('EINVAL_JSON_FILE', { path: filepath }), 'EINVAL_JSON_PARSE');

        return data;
    }

    write(directoryPath: string, data: NexusmodModuleOptions) {
        this.check(directoryPath);

        const filepath = this.resolve(directoryPath);
        const content = JSON.stringify(data, null, 2);
        const [error] = op<void, Parameters<typeof fs.writeFileSync>>(fs.writeFileSync, filepath, content, 'utf8');
        ensure(!error, error?.message ?? $t('EACCES_FILE', { path: filepath }), (error as NodeError)?.code ?? 'EACCES');

        return true;
    }
}

export default BannerlordHelperConfig;
