import { LANGUAGE_LIST } from '../constants';
import { LanguageManager } from '../utils';

export type LanguageOptions = (typeof LANGUAGE_LIST)[number];

const languageDictionary = new LanguageManager<LanguageOptions>(LANGUAGE_LIST);

export default languageDictionary;
