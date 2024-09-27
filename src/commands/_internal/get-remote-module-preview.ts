import { compare as compareVersion } from 'compare-versions';
import { type RemoteModuleOption, renderMarkdown } from '../../helper/index.js';
import locale from '../../locale/index.js';
import { compareDate, formatDate } from '../../utils/index.js';
import type { CompositeModuleConfig } from './get-updated-module-config.js';

async function getRemoteModulePreview(option: RemoteModuleOption<CompositeModuleConfig>, translation: string[]) {
    const outdatedVersion =
        option.remoteVersion && option.version && compareVersion(option.remoteVersion, option.version, '>');
    const outdatedFile =
        option.createTime &&
        option.lastUpdated &&
        compareDate(option.lastUpdated, formatDate(option.createTime, 'YYYY-MM-DD HH:mm'));

    if (option.isAdult) {
        (option.tags ||= []).push('NSFW');
    }

    return renderMarkdown(`
# ${option.title} [${translation[0]}]

\`[${option.tags?.join(']` `[') || 'NO TAG'}]\`

${option.url ?? ''}

---

${locale.LABEL_MOD_CURRENT_VERSION}: \`${option.version}\` | ${locale.LABEL_MOD_LATEST_VERSION}: \`${option.remoteVersion}\`${
        outdatedVersion ? ` | \`${locale.LABEL_MOD__VERSION_OUTDATED}\`` : ''
    }

${locale.LABEL_FILE_CURRENT_DATE}: \`${option.createTime}\` | ${locale.LABEL_FILE_LATEST_DATE}: \`${option.lastUpdated}\` | ${locale.LABEL_FILE_DOWNLOAD_DATE}: \`${option.downloadTime}\`${
        outdatedFile ? ` | \`${locale.LABEL_FILE_OUTDATED}\`` : ''
    }

---

## ${locale.LABEL_MOD_DESC}

${option.description}

${translation[1]}

---

## ${locale.LABEL_MOD_DEPENDENCIES}

${
    option.dependencies?.length
        ? '- ' +
          option.dependencies
              .map((item) => {
                  return item.id + (item.version ? `@${item.version}` : '');
              })
              .join('\n- ')
        : 'NO DEPENDENCIES'
}
`);
}

export default getRemoteModulePreview;
