import { type ModulePageOptions, translate, type TranslateOptions } from '../api';
import type { NativeModuleOptions } from '../helper';
import { $t } from '../shared';
import code from './_internal/code';
import compose from './_internal/compose';
import createRender from './_internal/create-render';
import heading from './_internal/heading';
import horizontalRules from './_internal/horizontal-rules';
import paragraph from './_internal/paragraph';

async function moduleDetail(
    module: NativeModuleOptions &
        ModulePageOptions & {
            nativeName: string;
            engine: TranslateOptions['engine'];
            target?: TranslateOptions['to'];
        },
) {
    const defaultLabel = '--';

    let describeTranslation: string | undefined;
    if (module.target && module.description) {
        describeTranslation = await translate(module.description, { engine: module.engine, to: module.target });
    }

    return compose(
        horizontalRules(),
        heading(
            `${$t('MODULE_NAME')}: ${module.title ?? module.name}${module.nativeName ? ` [${module.nativeName}]` : ''}`,
            1,
        ),
        paragraph(
            `${code(`[${module.builtin ? $t('BUILTIN_MODULE') : $t('EXTERNAL_MODULE')}]`)}${code(
                `[${module.type === 'Official' ? $t('OFFICIAL_MODULE') : $t('COMMUNITY_MODULE')}]`,
            )}${code(`[${module.category === 'Multiplayer' ? $t('MULTIPLAYER_MODULE') : $t('SINGLEPLAYER_MODULE')}]`)}`,
        ),
        paragraph(`${$t('DOWNLOAD_TIME')}: ${module.downloadTime} | ${$t('MODIFY_TIME')}: ${module.modifyTime}`),
        horizontalRules(),
        heading($t('FILE_INFORMATION'), 2),
        paragraph(
            `ID: ${code(module.id)} | ${$t('DIRECTORY')}: ${code(module.directory)} | ${$t('MODULE_PATH')}: ${code(
                module.path,
            )}`,
        ),
        paragraph(
            `${$t('CURRENT_VERSION')}: ${code(
                module.version ?? '--',
            )} | ${$t('LATEST_VERSION')}: ${code(module.remoteVersion ?? '--')}`,
        ),
        paragraph(
            `${$t('CURRENT_MODULE_DATE')}: ${code(
                module.updatedTime ?? '--',
            )} | ${$t('LATEST_MODULE_DATE')}: ${code(module.lastUpdated ?? '--')}`,
        ),
        horizontalRules(),
        heading($t('TAG'), 2),
        paragraph(`${module.tags.map((tag) => code(`[${tag}]`)).join(' ')}`),
        horizontalRules(),
        heading($t('MODULE_DESCRIPTION'), 2),
        paragraph(module.description ?? $t('NONE')),
        describeTranslation ? paragraph(describeTranslation) : undefined,
    );
}

export default createRender<Parameters<typeof moduleDetail>>(moduleDetail);
