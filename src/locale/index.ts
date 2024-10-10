import merge from 'lodash.merge';
import { osLocaleSync } from 'os-locale';
import deDE from './de-DE';
import enUS from './en-US';
import esES from './es-ES';
import frFR from './fr-FR';
import itIT from './it-IT';
import jaJP from './ja-JP';
import koKR from './ko-KR';
import plPL from './pl-PL';
import ptPT from './pt-PT';
import ruRU from './ru-RU';
import trTR from './tr-TR';
import zhCN from './zh-CN';
import zhTW from './zh-TW';

function getLocale() {
    const localeCode = osLocaleSync();
    const localeAbbr = localeCode.split('-')[0];

    switch (localeAbbr) {
        case 'pt': {
            return ptPT;
        }

        case 'zh': {
            return (
                {
                    'zh-CN': zhCN,
                    'zh-TW': zhTW,
                    'zh-HK': zhTW,
                }[localeCode] ?? zhCN
            );
        }

        case 'de': {
            return deDE;
        }

        case 'fr': {
            return frFR;
        }

        case 'it': {
            return itIT;
        }

        case 'ja': {
            return jaJP;
        }

        case 'ko': {
            return koKR;
        }

        case 'pl': {
            return plPL;
        }

        case 'ru': {
            return ruRU;
        }

        case 'es': {
            return esES;
        }

        case 'tr': {
            return trTR;
        }

        default: {
            return enUS;
        }
    }
}

const locale = merge<typeof enUS, ReturnType<typeof getLocale>>(enUS, getLocale());

export default locale;
