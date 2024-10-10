import confirm from '@inquirer/confirm';
import { $t } from '../shared';
import { clearDirectoryFile } from '../utils';

async function clearLanguagesDirectory(directoryPath: string, extension: string) {
    const deleteConfirm = await confirm({
        message: $t('TIP_FORCE_DELETED', { path: directoryPath, extension }),
        default: true,
    });

    if (deleteConfirm) clearDirectoryFile(directoryPath, extension);
}

export default clearLanguagesDirectory;
