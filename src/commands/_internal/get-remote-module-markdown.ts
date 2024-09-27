import dedent from 'dedent';
import { NodeHtmlMarkdown } from 'node-html-markdown';
import type { NexusModsOption } from '../../api/index.js';
import readRemoteModule from '../../helper/read-remote-module.js';
import locale from '../../locale/index.js';

async function getRemoteModuleMarkdown(module: NexusModsOption) {
    const {
        title,
        endorsements,
        uniqueDownloads,
        totalDownloads,
        totalViews,
        remoteVersion,
        gallery,
        lastUpdated,
        originalUpload,
        createdBy,
        uploadedBy,
        virusScan,
        tags,
        nativeName,
        htmlContent,
    } = await readRemoteModule<NexusModsOption>(module);

    const headerMd = `
# ${locale.LABEL_MOD_TITLE}: ${title} [${nativeName}]

---

${locale.LABEL_MOD_ENDORSEMENT}: \`${endorsements}\` | ${locale.LABEL_MOD_UNIQUE_DOWNLOAD}: \`${uniqueDownloads}\` | ${locale.LABEL_MOD_TOTAL_DOWNLOAD}: \`${totalDownloads}\` | ${locale.LABEL_MOD_TOTAL_VIEWS}: \`${totalViews}\` | ${locale.LABEL_MOD_VERSION}: \`${remoteVersion}\`

## ${locale.LABEL_MOD_THUMBNAIL}

- ${gallery?.join('\n- ') || 'none'}

${locale.LABEL_FILE_UPDATED}: \`${lastUpdated}\` | ${locale.LABEL_FILE_UPLOADED}: \`${originalUpload}\`

${locale.LABEL_FILE_CREATED_BY}: \`${createdBy}\` | ${locale.LABEL_FILE_UPLOADED_BY}: \`${uploadedBy}\` | ${locale.LABEL_FILE_VIRUS_SCAN}: \`${virusScan}\`

${locale.LABEL_MOD_TAG}: \`[${tags?.join(']` `[') || 'none'}]\`

---
`;

    const nhm = new NodeHtmlMarkdown({
        // BulletMarker: `${chalk.yellow('    *')}`
    });

    return {
        header: headerMd,
        content: htmlContent ? dedent(nhm.translate(htmlContent)) : '',
    };
}

export default getRemoteModuleMarkdown;
