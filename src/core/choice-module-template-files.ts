import get from 'lodash.get';
import { XML_CONFIGURATION } from '../constants';
import { LanguageDataXml } from '../helper';
import { $t } from '../shared';
import { ensure, pathExist, readdirFiles } from '../utils';

async function choiceModuleTemplateFiles(directoryPath: string, translateFrom: string) {
    const isExisted = pathExist(directoryPath);
    ensure(isExisted, $t('CMD_TRANSLATE_NO_LANGUAGES_DIR', { path: directoryPath }), 'ENOENT_LANGUAGES_DIR');

    if (translateFrom !== 'EN') {
        const isCatalogExisted = pathExist(`${directoryPath}\\language_data.xml`);
        ensure(isCatalogExisted, $t('CMD_TRANSLATE_NO_LANGUAGES_CATALOG_FILE'), 'ENOENT_LANGUAGES_CATALOG_FILE');

        const instance = new LanguageDataXml();
        const languageData = instance.read(directoryPath);
        const languageFiles = get(languageData, 'LanguageData.LanguageFile', []);
        return instance
            .normalizeLanguageFile(languageFiles)
            .map((item) => item['@_xml_path'].replace(new RegExp(`^${translateFrom}/`), ''));
    }

    const { ENABLED_FILE_EXTENSIONS: enabledExtensions } = XML_CONFIGURATION;
    return readdirFiles(directoryPath, { extensions: enabledExtensions });
}

export default choiceModuleTemplateFiles;
