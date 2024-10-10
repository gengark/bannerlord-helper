import { type Nullable } from '../../utils';

function compose(...contents: Array<Nullable<string>>) {
    return contents.filter(Boolean).join('\n');
}

export default compose;
