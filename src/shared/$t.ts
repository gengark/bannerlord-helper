import locale from '../locale';
import { I18n } from '../utils';

const instance = new I18n<typeof locale>(locale);

const { $t } = instance;

export default $t;
