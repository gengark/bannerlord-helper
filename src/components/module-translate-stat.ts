import { $t } from '../shared';
import compose from './_internal/compose';
import createRender from './_internal/create-render';
import heading from './_internal/heading';
import horizontalRules from './_internal/horizontal-rules';
import table from './_internal/table';

export interface ModuleTranslateStatOptions {
    filename: string;
    status: 200 | 404 | 500;
    targetIds?: string[];
    ids?: string[];
    appendIds?: string[];
}

function moduleTranslateStat(stats: ModuleTranslateStatOptions[]) {
    return compose(
        horizontalRules(),
        heading($t('TRANSLATE_TEMPLATE_STAT'), 1),
        table(
            [$t('FILE'), $t('TEXT_ITEMS'), $t('EXISTING_ITEMS'), $t('NEW_ITEMS')],
            stats.map((item) => {
                switch (item.status) {
                    case 200: {
                        return [
                            item.filename,
                            item.targetIds!.length,
                            item.targetIds!.length > 0 ? item.ids!.length : '-',
                            item.targetIds!.length > 0 ? item.appendIds!.length : '-',
                        ];
                    }

                    case 404: {
                        return [item.filename, $t('NO_TEMPLATE_FILE')];
                    }

                    default: {
                        return [item.filename, undefined, undefined, $t('EXEC_FAILED')];
                    }
                }
            }),
        ),
    );
}

export default createRender<Parameters<typeof moduleTranslateStat>>(moduleTranslateStat);
