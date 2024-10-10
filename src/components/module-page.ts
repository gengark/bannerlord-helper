import { type ModulePageOptions, type NexusmodModuleOptions, translate, type TranslateOptions } from '../api';
import { $t } from '../shared';
import code from './_internal/code';
import compose from './_internal/compose';
import createRender from './_internal/create-render';
import heading from './_internal/heading';
import horizontalRules from './_internal/horizontal-rules';
import html from './_internal/html';
import paragraph from './_internal/paragraph';
import unorderedList from './_internal/unordered-list';

async function modulePage(
    module: NexusmodModuleOptions &
        ModulePageOptions & {
            nativeName: string;
            engine: TranslateOptions['engine'];
            target?: TranslateOptions['to'];
        },
) {
    const defaultLabel = '--';

    let htmlContent: string = html(module.htmlContent);
    if (module.target) {
        htmlContent = await translate(htmlContent, { engine: module.engine, to: module.target });
    }

    return compose(
        horizontalRules(),
        heading(
            `${$t('MODULE_NAME')}: ${module.title ?? module.name}${module.nativeName ? ` [${module.nativeName}]` : ''}`,
            1,
        ),
        paragraph(
            `${$t('ENDORSEMENT')}: ${code(module.endorsements ?? defaultLabel)} | ${$t('UNIQUE_DOWNLOADS')}: ${code(
                module.uniqueDownloads ?? defaultLabel,
            )} | ${$t('DOWNLOAD')}: ${code(
                module.totalDownloads ?? module.downloads ?? defaultLabel,
            )} | ${$t('VIEWS')}: ${code(module.totalViews ?? defaultLabel)} | ${$t('VERSION')}: ${code(
                module.remoteVersion ?? defaultLabel,
            )}`,
        ),
        paragraph(
            `${$t('AUTHOR')}: ${code(
                module.createdBy ?? module.author.name,
            )} | ${$t('UPLOADER')}: ${code(module.uploadedBy ?? defaultLabel)} | ${$t(
                'VIRUS_SCAN',
            )}: ${code(module.virusScan ?? defaultLabel)}`,
        ),
        paragraph(
            `${$t('UPDATED_TIME')}: ${code(
                module.lastUpdated ?? defaultLabel,
            )} | ${$t('UPLOADED_TIME')}: ${code(module.originalUpload ?? defaultLabel)}`,
        ),
        paragraph(`${$t('TAG')}: ${module.tags.map((tag) => code(`[${tag}]`)).join(' ')}`),
        heading($t('GALLERY'), 2),
        unorderedList(module.gallery ?? []),
        horizontalRules(),
        htmlContent,
    );
}

export default createRender<Parameters<typeof modulePage>>(modulePage);
