import get from 'lodash.get';
import template from 'lodash.template';

interface NestedRecord {
    [key: string]: string | NestedRecord;
}

type Join<K, P> = K extends string | number ? (P extends string | number ? `${K}.${P}` : never) : never;

type Paths<T> = T extends object
    ? {
          [K in keyof T]: T[K] extends object ? Join<K, Paths<T[K]>> : K;
      }[keyof T]
    : never;

class I18n<T extends NestedRecord> {
    protected readonly dictionary: NestedRecord;

    constructor(locale: NestedRecord) {
        this.dictionary = locale;
        this.$t = this.$t.bind(this);
    }

    public $t(path: Paths<T>, variables?: Record<string, string>): string {
        const value = get(this.dictionary, path);

        if (typeof value === 'string') {
            return this.compiled(value, variables);
        }

        return path;
    }

    protected compiled(value: string, variables?: Record<string, string>) {
        if (variables) return this.compiler(value)(variables);
        return value;
    }

    private compiler(value: string) {
        return template(value, { interpolate: /{{([\s\S]+?)}}/g });
    }
}

export default I18n;
