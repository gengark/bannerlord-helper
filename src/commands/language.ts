import ora from 'ora';
import { renderMarkdown } from '../helper/index.js';
import locale from '../locale/index.js';
import { Languages, LANGUAGES_LIST } from '../shared/index.js';

export interface LanguageCommandOption {
    codeOrName?: string;
}

async function language({ codeOrName }: { codeOrName?: string }) {
    if (codeOrName) {
        const [option] = Languages.getLanguages([codeOrName.toLowerCase()]);
        const { code, name, nativeName } = option || {};

        if (!code && !name) {
            ora().fail(locale.EINVAL_LANG_CODE_OR_NAME);
            return;
        }

        const md = await renderMarkdown(`## Language\n\n\`    ${code}\`: **${name}** [${nativeName}]`);
        console.log(md);
    } else {
        const title = `## ${locale.LABEL_MD_LANG_SUPPORT}`;

        const tableHeader = '|CODE|NAME|NATIVE NAME|';
        const tableSeparator = '| - | - | - |';
        const tableBodyFixed = '| | | |';

        const list = LANGUAGES_LIST.map((item) => {
            return `| ${item.code} | ${item.name} | ${item.nativeName} |`;
        });

        const md = await renderMarkdown(
            `${title}\n\n${tableHeader}\n${tableSeparator}\n${tableBodyFixed}\n${list.join('\n')}`,
        );

        console.log(md);
    }
}

export default language;
