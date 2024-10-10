/* eslint-disable @typescript-eslint/naming-convention */
export const EN_LANGUAGE = {
    code: 'EN',
    microsoft: 'en',
    google: 'en',
    deeplx: 'en',
    name: 'English',
    nativeName: 'English',
    suffix: 'xml',
} as const;

export const CNS_LANGUAGE = {
    code: 'CNs',
    microsoft: 'zh-Hans',
    google: 'zh-cn',
    deeplx: 'zh-Hans',
    name: 'Chinese Simplified',
    nativeName: '简体中文',
    suffix: 'xml-zho-CN',
} as const;

export const CNT_LANGUAGE = {
    code: 'CNt',
    microsoft: 'zh-Hant',
    google: 'zh-tw',
    deeplx: 'zh-Hant',
    name: 'Chinese Traditional',
    nativeName: '繁體中文',
    suffix: 'xml-zho-HK',
} as const;

export const BR_LANGUAGE = {
    code: 'BR',
    microsoft: 'pt',
    google: 'pt',
    deeplx: 'pt',
    name: 'Portuguese (Brazil)',
    nativeName: 'Português (BR)',
    suffix: 'xml-por-BR',
} as const;

export const DE_LANGUAGE = {
    code: 'DE',
    microsoft: 'de',
    google: 'de',
    deeplx: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    suffix: 'xml-ger',
} as const;

export const FR_LANGUAGE = {
    code: 'FR',
    microsoft: 'fr',
    google: 'fr',
    deeplx: 'fr',
    name: 'French',
    nativeName: 'Français',
    suffix: 'xml-fre',
} as const;

export const IT_LANGUAGE = {
    code: 'IT',
    microsoft: 'it',
    google: 'it',
    deeplx: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    suffix: 'xml-ita',
} as const;

export const JA_LANGUAGE = {
    code: 'JP',
    microsoft: 'ja',
    google: 'ja',
    deeplx: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    suffix: 'xml_jpn',
} as const;

export const KO_LANGUAGE = {
    code: 'KO',
    microsoft: 'ko',
    google: 'ko',
    deeplx: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    suffix: 'xml_kor',
} as const;

export const PT_LANGUAGE = {
    code: 'PL',
    microsoft: 'pl',
    google: 'pl',
    deeplx: 'pl',
    name: 'Polish',
    nativeName: 'Polski',
    suffix: 'xml_pol',
} as const;

export const RU_LANGUAGE = {
    code: 'RU',
    microsoft: 'ru',
    google: 'ru',
    deeplx: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    suffix: 'xml_rus',
} as const;

export const ES_LANGUAGE = {
    code: 'SP',
    microsoft: 'es',
    google: 'es',
    deeplx: 'es',
    name: 'Spanish',
    nativeName: 'Español (LA)',
    suffix: 'xml-spa-M9',
} as const;

export const TR_LANGUAGE = {
    code: 'TR',
    microsoft: 'tr',
    google: 'tr',
    deeplx: 'tr',
    name: 'Turkish',
    nativeName: 'Türkçe',
    suffix: 'xml_tr',
} as const;

const LANGUAGE_LIST = [
    EN_LANGUAGE,
    BR_LANGUAGE,
    CNS_LANGUAGE,
    CNT_LANGUAGE,
    DE_LANGUAGE,
    FR_LANGUAGE,
    IT_LANGUAGE,
    JA_LANGUAGE,
    KO_LANGUAGE,
    PT_LANGUAGE,
    RU_LANGUAGE,
    ES_LANGUAGE,
    TR_LANGUAGE,
];

export default LANGUAGE_LIST;
