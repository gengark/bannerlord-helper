export type LanguageRecord<T extends Record<string, string | number | boolean | undefined> = {}> = {
    readonly code: string;
    readonly name: string;
    readonly nativeName: string;
} & {
    [key in keyof T]?: T[key];
};

export default class LanguageManager<T extends Omit<LanguageRecord, 'code' | 'name' | 'nativeName'> = {}> {
    protected readonly codes: Array<LanguageRecord['code']> = [];

    protected readonly names: Array<LanguageRecord['name']> = [];

    protected readonly nativeNames: Array<LanguageRecord['nativeName']> = [];

    protected readonly languages = new Map<LanguageRecord['code'], LanguageRecord<T>>();

    protected readonly inversionLanguages = new Map<LanguageRecord['name'], LanguageRecord<T>>();

    constructor(list: Array<LanguageRecord<T>>) {
        for (const record of list) {
            this.codes.push(record.code);
            this.names.push(record.name);
            this.nativeNames.push(record.nativeName);

            this.languages.set(record.code.toLowerCase(), record);
            this.inversionLanguages.set(record.name.toLowerCase(), record);
            this.inversionLanguages.set(record.nativeName.toLowerCase(), record);
        }
    }

    getLanguage(codeOrName: LanguageRecord['code']): LanguageRecord<T> | undefined {
        codeOrName = codeOrName.toLowerCase();
        if (this.validate(codeOrName)) {
            return this.languages.get(codeOrName);
        }

        if (this.inversionLanguages.has(codeOrName)) {
            return this.inversionLanguages.get(codeOrName);
        }
    }

    getLanguages(codeOrNameList: Array<LanguageRecord['code']>) {
        return codeOrNameList.map((codeOrName) => this.getLanguage(codeOrName));
    }

    getAllLanguages() {
        return [...this.languages.values()];
    }

    getName(code: LanguageRecord['code']): string | undefined {
        code = code.toLowerCase();
        if (this.validate(code)) {
            return this.languages.get(code)!.name;
        }
    }

    getAllNames(): Array<LanguageRecord['name']> {
        return [...this.names];
    }

    getNativeName(code: LanguageRecord['code']) {
        code = code.toLowerCase();
        if (this.validate(code)) {
            return this.languages.get(code)!.nativeName;
        }
    }

    getAllNativeNames(): Array<LanguageRecord['nativeName']> {
        return [...this.nativeNames];
    }

    getCode(name: LanguageRecord['name']): string | undefined {
        name = name.toLowerCase();
        return this.inversionLanguages.has(name) ? this.inversionLanguages.get(name)!.code : undefined;
    }

    getAllCodes() {
        return [...this.codes];
    }

    validate(code: LanguageRecord['code']): code is LanguageRecord['code'] {
        return this.codes.map((item) => item.toLowerCase()).includes(code.toLowerCase());
    }
}
