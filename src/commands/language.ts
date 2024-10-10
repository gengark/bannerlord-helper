import ora from 'ora';
import { validateTranslateLanguage } from '../api';
import { renderSupportLanguages } from '../components';
import { useDurationPrint } from '../helper';
import { languageDictionary } from '../shared';
import { op } from '../utils';

export interface LanguageCommandOptions {
    codeOrName?: string;
}

async function language({ codeOrName }: LanguageCommandOptions = {}) {
    const printDuration = useDurationPrint();
    const lang = codeOrName
        ? languageDictionary.getLanguage(codeOrName)
        : {
              code: undefined,
              name: undefined,
              nativeName: undefined,
          };
    const [error, isValid] = codeOrName ? op(validateTranslateLanguage, lang?.code ?? codeOrName) : [];
    if (error) {
        ora().fail(error.message);
        return;
    }

    if (isValid) {
        ora().succeed(`${lang!.code}: ${lang!.name} [${lang!.nativeName}]`);
        return;
    }

    const md = await renderSupportLanguages(languageDictionary.getAllLanguages());
    console.log(md);
    printDuration();
}

export default language;
