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
    let targetTotal = 0;
    let total = 0;
    let appendTotal = 0;

    return compose(
        horizontalRules(),
        heading($t('GENERATE_TEMPLATE_STAT'), 1),
        table(
            [$t('FILE'), $t('TEXT_ITEMS'), $t('EXISTING_ITEMS'), $t('NEW_ITEMS')],
            [
                ...stats.map((item) => {
                    targetTotal += item.targetIds?.length ?? 0;
                    total += item.ids?.length ?? 0;
                    appendTotal += item.appendIds?.length ?? 0;

                    return [
                        item.filename,
                        item.targetIds.length,
                        item.targetIds.length > 0 ? item.ids.length : '-',
                        item.targetIds.length > 0 ? item.appendIds.length : '-',
                    ];
                }),
                [$t('TOTAL'), `${targetTotal}`, `${total}`, `${appendTotal}`],
            ],
        ),
    );
}

export default createRender<Parameters<typeof moduleGenerateStat>>(moduleGenerateStat);
