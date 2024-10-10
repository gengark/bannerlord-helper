import fs from 'node:fs';
import path from 'node:path';
import cloneDeep from 'lodash.clonedeep';
import get from 'lodash.get';
import set from 'lodash.set';
import uniqBy from 'lodash.uniqby';
import { $t } from '../shared';
import { type Arrayable, ensure, isPlainObject, type NodeError, op, XML } from '../utils';
import ModuleXml from './module-xml';

interface XsltStandardOptions {
    '@_version': '1.0';
    '@_xmlns:xsl': 'http://www.w3.org/1999/XSL/Transform';
}

interface ExternalXsltOutputOptions {
    '@_omit-xml-declaration': 'yes';
}

interface ExternalXsltCopyOptions {
    'xsl:copy': {
        'xsl:apply-templates': {
            '@_select': '@*|node()';
        };
    };
    '@_match': '@*|node()';
}

export interface ExternalXsltAttributeOptions {
    'xsl:attribute': {
        '#text': string;
        '@_name': string;
    };
    '@_match': string;
}

export interface ExternalXsltStylesheetOptions extends XsltStandardOptions {
    'xsl:output': ExternalXsltOutputOptions;
    'xsl:template': [ExternalXsltCopyOptions, ...ExternalXsltAttributeOptions[]];
}

export interface ExternalXsltOptions {
    'xsl:stylesheet': ExternalXsltStylesheetOptions;
}

// @ts-expect-error: TS2344: Type ExternalXsltOptions does not satisfy the constraint XmlStandardOptions
class ExternalXslt extends ModuleXml<ExternalXsltOptions> {
    resolve(filepath: string) {
        const directoryPath = path.dirname(filepath);
        const filename = path.basename(filepath);
        return path.resolve(directoryPath, this.normalizeFilename(filename));
    }

    create(options: Array<{ id: string; type: string; key: string; text: string }>): ExternalXsltOptions {
        /* eslint-disable @typescript-eslint/naming-convention */
        return {
            'xsl:stylesheet': {
                ...this.createStandard(),
                'xsl:template': [this.createStandardTemplate(), ...this.createExternalList(options)],
            },
        };
        /* eslint-enable @typescript-eslint/naming-convention */
    }

    merge(data: ExternalXsltOptions, source?: ExternalXsltOptions) {
        if (!source) return data;

        const [defaultOption, ...list] = get(data, 'xsl:stylesheet.xsl:template', []);
        const dataList = this.normalizeTemplate(list);

        const [_, ...sourceStrings] = get(source, 'xsl:stylesheet.xsl:template', []);
        const sourceList = this.normalizeTemplate(sourceStrings);

        const compositeStrings = uniqBy([...dataList, ...sourceList], '@_match');

        return set(cloneDeep(data), 'xsl:stylesheet.xsl:template', [defaultOption, ...compositeStrings]);
    }

    read(filepath: string) {
        return super.read(this.resolve(filepath));
    }

    write(filepath: string, data: ExternalXsltOptions) {
        const targetFilepath = this.normalizeFilename(filepath);
        this.check(path.dirname(targetFilepath));

        const content = XML.stringify<ExternalXsltOptions>(data).replace(/&apos;/g, "'");
        const [error] = op<void, Parameters<typeof fs.writeFileSync>>(
            fs.writeFileSync,
            targetFilepath,
            content,
            'utf8',
        );
        ensure(
            !error,
            error?.message ?? $t('EACCES_FILE', { path: targetFilepath }),
            (error as NodeError)?.code ?? 'EACCES',
        );

        return true;
    }

    normalizeFilename(filename: string) {
        const _filename = filename.replace(/^[/\\]+/, '');
        if (/.xslt$/.test(_filename)) {
            return _filename;
        }

        return `${_filename}.xslt`;
    }

    normalizeTemplate(list: Arrayable<ExternalXsltCopyOptions | ExternalXsltAttributeOptions> | '') {
        if (typeof list === 'string') return [];
        if (isPlainObject<ExternalXsltStylesheetOptions['xsl:template']>(list))
            return [list as unknown as ExternalXsltAttributeOptions];
        return (list as ExternalXsltAttributeOptions[]).filter((item) => item['xsl:attribute']);
    }

    createStandard(): XsltStandardOptions & { 'xsl:output': ExternalXsltOutputOptions } {
        /* eslint-disable @typescript-eslint/naming-convention */
        return {
            '@_version': '1.0',
            '@_xmlns:xsl': 'http://www.w3.org/1999/XSL/Transform',
            'xsl:output': { '@_omit-xml-declaration': 'yes' },
        };
        /* eslint-enable @typescript-eslint/naming-convention */
    }

    createStandardTemplate(): ExternalXsltCopyOptions {
        /* eslint-disable @typescript-eslint/naming-convention */
        return {
            'xsl:copy': {
                'xsl:apply-templates': {
                    '@_select': '@*|node()',
                },
            },
            '@_match': '@*|node()',
        };
        /* eslint-enable @typescript-eslint/naming-convention */
    }

    createExternalList(
        options: Array<{
            id: string;
            type: string;
            key: string;
            text: string;
        }>,
    ): ExternalXsltAttributeOptions[] {
        /* eslint-disable @typescript-eslint/naming-convention */
        return options.map((item) => ({
            'xsl:attribute': {
                '#text': item.text,
                '@_name': item.key,
            },
            '@_match': `${item.type}[@id='${item.id}']/@${item.key}`,
        }));
        /* eslint-enable @typescript-eslint/naming-convention */
    }
}

export default ExternalXslt;
