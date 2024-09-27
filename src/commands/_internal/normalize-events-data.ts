import fs from 'node:fs';
import get from 'lodash.get';
import set from 'lodash.set';
import { eventsDataXml, type EventsDataXmlEvent, type EventsDataXmlEventOption } from '../../helper/index.js';
import { ErrorCodes } from '../../shared/index.js';
import { ensure, hash, isObject, type NodeError, run } from '../../utils/index.js';
import type { ModuleDataDictionary } from './normalize-module-data.js';

// ModItem { id: { name, key } }
type ModuleDataItemOption = Record<
    string,
    {
        name: string;
        key: string;
    }
>;

function normalizeEventsData(eventsPath: string): ModuleDataDictionary {
    const [accessError] = run<void, NodeError>(fs.accessSync, eventsPath, fs.constants.R_OK | fs.constants.W_OK);
    ensure(!accessError, accessError?.message ?? 'Can not find ModuleData directory', ErrorCodes.EACCES_FILE);

    const [error, dictionary] = run<ModuleDataDictionary>(getModuleDataDictionary, eventsPath, {
        enabledExtension: ['xml'],
        illegalKeys: ['*'],
        freezeKeys: ['!'],
    });
    ensure(!error, error?.message ?? 'An error occurred while organizing translatable files');
    ensure(dictionary.size, 'No files available for translation', ErrorCodes.EINVAL_LANG_FILE_EMPTY);

    return dictionary;
}

function getModuleDataDictionary(
    eventsPath: string,
    {
        enabledExtension,
        illegalKeys,
        freezeKeys,
    }: Record<'enabledExtension' | 'enabledTags' | 'illegalKeys' | 'freezeKeys', string[]>,
): ModuleDataDictionary {
    const dictionary = new Map<string, ModuleDataItemOption>();
    const getTranslationKey = (text: string) => /^{=[\s\w*!]+}/.exec(text)?.[0]?.replace(/^{=|}$/g, '');

    for (const file of fs.readdirSync(eventsPath)) {
        const fileExtension = file.split('.').pop();
        if (!fileExtension || !enabledExtension.includes(fileExtension)) continue;

        const disabledKey = new Set<string>(illegalKeys);

        const result: ModuleDataItemOption = {};
        const record = eventsDataXml.read(eventsPath, file);

        const eventTag = 'CEEvents.CEEvent';
        const optionTag = 'Options.Option';

        let events = get(record, eventTag);
        if (!events) continue;
        const isSingleEvent = isObject<EventsDataXmlEvent>(events);
        if (isSingleEvent) {
            events = [events as EventsDataXmlEvent];
        }

        let eventIndex = 0;
        for (const event of events as EventsDataXmlEvent[]) {
            const id = get(event, 'Name');
            if (!id) continue;

            const value = get(event, 'Text');
            if (!value) continue;

            const key = getTranslationKey(value);
            if (key && freezeKeys.includes(key)) continue;

            const name = key ? value.replace(`{=${key}}`, '') : value;
            if (!name) continue;

            const invalidKey = !key || disabledKey.has(key);
            const pureKey = invalidKey ? hash(`${file}${id}${name}`, 8) : key;
            disabledKey.add(pureKey);

            if (invalidKey) {
                const recordPath = isSingleEvent ? `${eventTag}.Text` : `${eventTag}.${eventIndex}.Text`;
                set(record, recordPath, `{=${pureKey}}${name}`);
            }

            set(result, id, { name, key: pureKey });

            let options = get(event, optionTag);
            if (!options) continue;

            const isSingleOption = isObject<EventsDataXmlEventOption>(options);
            if (isSingleOption) {
                options = [options as EventsDataXmlEventOption];
            }

            let optionIndex = 0;
            for (const option of options as EventsDataXmlEventOption[]) {
                const optionOrder = get(option, 'Order');
                if (typeof optionOrder !== 'number') continue;
                const optionId = `${id}_Option_${optionOrder}`;

                const optionValue = get(option, 'OptionText');
                if (!optionValue) continue;

                const optionKey = getTranslationKey(optionValue);
                if (optionKey && freezeKeys.includes(optionKey)) continue;

                const optionName = optionKey ? optionValue.replace(`{=${optionKey}}`, '') : optionValue;
                if (!optionName) continue;

                const invalidOptionKey = !optionKey || disabledKey.has(optionKey);
                const pureOptionKey = invalidOptionKey ? hash(`${file}${optionId}${optionName}`, 8) : optionKey;
                disabledKey.add(pureOptionKey);

                if (invalidOptionKey) {
                    const eventOptionTag = isSingleEvent
                        ? `${eventTag}.${optionTag}`
                        : `${eventTag}.${eventIndex}.${optionTag}`;
                    const recordPath = isSingleOption
                        ? `${eventOptionTag}.OptionText`
                        : `${eventOptionTag}.${optionIndex}.OptionText`;
                    set(record, recordPath, `{=${pureOptionKey}}${optionName}`);
                }

                set(result, optionId, { name: optionName, key: pureOptionKey });

                optionIndex++;
            }

            eventIndex++;
        }

        if (Object.keys(result).length === 0) {
            continue;
        }

        dictionary.set(file, result);
        eventsDataXml.write(eventsPath, file, record);
    }

    return dictionary;
}

export default normalizeEventsData;
