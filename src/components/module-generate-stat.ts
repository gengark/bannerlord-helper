import { $t } from '../shared';
import compose from './_internal/compose';
import createRender from './_internal/create-render';
import heading from './_internal/heading';
import horizontalRules from './_internal/horizontal-rules';
import table from './_internal/table';

function moduleGenerateStat(
    stats: Array<{
        filename: string;
        targetIds: string[];
        ids: string[];
        appendIds: string[];
    }>,
) {
    return compose(
        horizontalRules(),
        heading($t('GENERATE_TEMPLATE_STAT'), 1),
        table(
            [$t('FILE'), $t('TEXT_ITEMS'), $t('EXISTING_ITEMS'), $t('NEW_ITEMS')],
            stats.map((item) => [
                item.filename,
                item.targetIds.length,
                item.targetIds.length > 0 ? item.ids.length : '-',
                item.targetIds.length > 0 ? item.appendIds.length : '-',
            ]),
        ),
    );
}

export default createRender<Parameters<typeof moduleGenerateStat>>(moduleGenerateStat);
