export type LanguageRecord = (typeof LANGUAGES_LIST)[number];
type LanguageCode = LanguageRecord['code'];

export const LANGUAGES_LIST = [
    { code: 'EN', bing: 'en', google: 'en', name: 'English', nativeName: 'English' },
    { code: 'BR', bing: 'pt', google: 'pt', name: 'Portuguese (Brazil)', nativeName: 'Português (BR)' },
    { code: 'CNs', bing: 'zh-Hans', google: 'zh-cn', name: 'Chinese Simplified', nativeName: '简体中文' },
    { code: 'CNt', bing: 'zh-Hant', google: 'zh-tw', name: 'Chinese Traditional', nativeName: '繁體中文' },
    { code: 'DE', bing: 'de', google: 'de', name: 'German', nativeName: 'Deutsch' },
    { code: 'FR', bing: 'fr', google: 'fr', name: 'French', nativeName: 'Français' },
    { code: 'IT', bing: 'it', google: 'it', name: 'Italian', nativeName: 'Italiano' },
    { code: 'JP', bing: 'ja', google: 'ja', name: 'Japanese', nativeName: '日本語' },
    { code: 'KO', bing: 'ko', google: 'ko', name: 'Korean', nativeName: '한국어' },
    { code: 'PL', bing: 'pl', google: 'pl', name: 'Polish', nativeName: 'Polski' },
    { code: 'RU', bing: 'ru', google: 'ru', name: 'Russian', nativeName: 'Русский' },
    { code: 'SP', bing: 'es', google: 'es', name: 'Spanish', nativeName: 'Español (LA)' },
    { code: 'TR', bing: 'tr', google: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
] as const;

const LANGUAGES = Object.fromEntries(
    LANGUAGES_LIST.map((current: LanguageRecord) => [current.code.toLowerCase(), current]),
);

const Languages = {
    getLanguages(codesOrNames: string[] = []): Array<LanguageRecord | undefined> {
        return codesOrNames.map((codeOrName) => {
            if (Languages.validate(codeOrName)) return { ...LANGUAGES[codeOrName] };

            const code = Languages.getCode(codeOrName);
            if (code) return { ...LANGUAGES[code.toLowerCase() as Lowercase<LanguageCode>] };

            return undefined;
        });
    },

    getName(code: string): LanguageRecord['name'] | '' {
        return Languages.validate(code) ? LANGUAGES[code].name : '';
    },

    getAllNames(): Array<LanguageRecord['name']> {
        return LANGUAGES_LIST.map((item) => item.name);
    },

    getNativeName(code: string): string {
        return Languages.validate(code) ? LANGUAGES[code].nativeName : '';
    },

    getAllNativeNames(): Array<LanguageRecord['nativeName']> {
        return LANGUAGES_LIST.map((item) => item.nativeName);
    },

    getCode(name: string): LanguageCode | '' {
        return LANGUAGES_LIST.find((item) => item.name.toLowerCase() === name.toLowerCase())?.code ?? '';
    },

    getAllCodes(): LanguageCode[] {
        return LANGUAGES_LIST.map((item) => item.code);
    },

    validate(code: string): code is Lowercase<LanguageCode> {
        return Object.hasOwn(LANGUAGES, code);
    },
};

export default Languages;
