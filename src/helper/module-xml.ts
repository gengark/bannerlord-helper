import fs from 'node:fs';
import path from 'node:path';
import { $t } from '../shared';
import { type Arrayable, ensure, type NodeError, op, readFile, XML } from '../utils';

export interface XmlStandardOptions {
    '?xml': {
        '@_version': string;
        '@_encoding': string;
    };
}

export interface ValueAttributeTag<T extends string = string> {
    '@_value': T;
}

export type LiteralBoolean = 'true' | 'false';

class ModuleXml<T extends XmlStandardOptions> {
    check(filepath: string) {
        // eslint-disable-next-line no-bitwise
        const [error] = op<void, [string, number]>(fs.accessSync, filepath, fs.constants.R_OK | fs.constants.W_OK);
        ensure(!error, error?.message ?? $t('EACCES_FILE', { path: filepath }), (error as NodeError)?.code ?? 'EACCES');
        return true;
    }

    read(filepath: string): T {
        this.check(filepath);

        const content = readFile(filepath);
        const [error, data] = op<T, [string]>(XML.parse.bind(XML), content);
        ensure(!error, error?.message ?? $t('EINVAL_XML_FILE', { path: filepath }), 'EINVAL_XML_PARSE');

        return data;
    }

    write(filepath: string, data: T) {
        this.check(path.dirname(filepath));

        const content = XML.stringify<T>(data);
        const [error] = op<void, Parameters<typeof fs.writeFileSync>>(fs.writeFileSync, filepath, content, 'utf8');
        ensure(!error, error?.message ?? $t('EACCES_FILE', { path: filepath }), (error as NodeError)?.code ?? 'EACCES');

        return true;
    }

    protected createHeader(version?: string, encoding?: string): XmlStandardOptions {
        /* eslint-disable @typescript-eslint/naming-convention */
        return {
            '?xml': {
                '@_version': version ?? '1.0',
                '@_encoding': encoding ?? 'utf8',
            },
        };
        /* eslint-enable @typescript-eslint/naming-convention */
    }

    protected createValueAttributeTag<T extends string = string>(value: T): ValueAttributeTag<T> {
        return {
            '@_value': value /* eslint-disable-line @typescript-eslint/naming-convention */,
        };
    }

    protected createArrayableTag<K extends string, T extends object | string | undefined, U = T>(
        key: K,
        list?: T[],
        remapping?: (item: T, index: number, array: T[]) => U,
    ): { [P in K]: Arrayable<U> } | '' {
        if (!list?.length) return '';

        if (list.length === 1)
            // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
            return {
                [key]: (remapping?.(list[0], 0, list) ?? list[0]) as U,
            } as { [P in K]: Arrayable<U> };

        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        return {
            [key]: list.map((item, index, array) => remapping?.(item, index, array) ?? item) as U[],
        } as { [P in K]: Arrayable<U> };
    }
}

export default ModuleXml;
