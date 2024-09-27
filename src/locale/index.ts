import { osLocaleSync } from 'os-locale';
import deDE from './de-DE.js';
import enUS from './en-US.js';
import esES from './es-ES.js';
import frFR from './fr-FR.js';
import itIT from './it-IT.js';
import jaJP from './ja-JP.js';
import koKR from './ko-KR.js';
import plPL from './pl-PL.js';
import ptPT from './pt-PT.js';
import ruRU from './ru-RU.js';
import trTR from './tr-TR.js';
import zhCN from './zh-CN.js';
import zhTW from './zh-TW.js';

function getLocale() {
    const locale = osLocaleSync();
    const abbr = locale.split('-')[0];

    switch (abbr) {
        case 'pt': {
            return ptPT;
        }

        case 'zh': {
            return {
                'zh-CN': zhCN,
                'zh-TW': zhTW,
                'zh-HK': zhTW,
            }[locale] ?? enUS;
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

export default getLocale();
