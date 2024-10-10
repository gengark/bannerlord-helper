import { validateTranslateEngine, validateTranslateLanguage } from '../api';
import { languageDictionary } from '../shared';

export interface CommandTranslateOptions {
    engine?: string;
    target?: string;
    source?: string;
}

function normalizeTranslateOptions({ engine, target, source }: CommandTranslateOptions) {
    const translateEngine = engine && validateTranslateEngine(engine) ? engine : 'microsoft';
    const translateTo =
        target && validateTranslateLanguage(target, 'EINVAL_TRANSLATE_OPTION_TO')
            ? languageDictionary.getLanguage(target)!.code
            : undefined;
    const translateFrom =
        source && validateTranslateLanguage(source, 'EINVAL_TRANSLATE_OPTION_FROM')
            ? languageDictionary.getLanguage(source)!.code
            : undefined;

    return { translateEngine, translateTo, translateFrom };
}

export default normalizeTranslateOptions;
