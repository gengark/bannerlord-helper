import { $t, type LanguageOptions } from '../shared';
import { type LanguageRecord } from '../utils';
import compose from './_internal/compose';
import createRender from './_internal/create-render';
import heading from './_internal/heading';
import horizontalRules from './_internal/horizontal-rules';
import table from './_internal/table';

function supportLanguages(list: Array<LanguageRecord<LanguageOptions>>) {
    return compose(
        horizontalRules(),
        heading($t('SUPPORTED_LANGUAGES'), 1),
        table(
            [$t('LANGUAGE_CODE'), $t('LANGUAGE_NAME'), $t('NATIVE_NAME'), $t('FILE_SUFFIX')],
            list.map((item) => [item.code, item.name, item.nativeName, item.suffix]),
        ),
    );
}

export default createRender<Parameters<typeof supportLanguages>>(supportLanguages);
