import fs from 'node:fs';
import { ErrorCodes } from '../shared/index.js';
import { ensure, type NodeError, readFileSync, run, XML } from '../utils/index.js';

interface EventsDataXmlHeader {
    '@_version': '1.0';
    '@_encoding': 'utf-16';
}

type RestrictedListOfFlags =
    | 'Captor'
    | 'LocationTravellingParty'
    | 'CaptorGenderIsFemale'
    | 'CaptorGenderIsMale'
    | 'CaptiveIsNonHero'
    | 'Common'
    | 'CanOnlyBeTriggeredByOtherEvent'
    | string;

interface EventsDataXmlEventFlags {
    RestrictedListOfFlags: RestrictedListOfFlags[];
}

export interface EventsDataXmlEventOption {
    Order: number;
    MultipleRestrictedListOfConsequences: {
        RestrictedListOfConsequences: ('Continue' | 'ChangeMorale' | string)[];
    };
    OptionText: string;
    TriggerEventName: string;
}

export interface EventsDataXmlEvent {
    Name: string;
    Text: string;
    BackgroundName: string;
    MultipleRestrictedListOfFlags: EventsDataXmlEventFlags;
    Options: {
        Option: EventsDataXmlEventOption | EventsDataXmlEventOption[]
    };
    ReqCustomCode: boolean;
    SexualContent: boolean;
    WeightedChanceOfOccuring: number;
    ReqHeroMinAge: number;
}

interface EventsDataXmlData {
    '@_xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance';
    '@_xsi:noNamespaceSchemaLocation': 'file://CEEventsModal.xsd';
    CEEvent: EventsDataXmlEvent | EventsDataXmlEvent[];
}

export interface EventsDataXml {
    '?xml': EventsDataXmlHeader;
    CEEvents: EventsDataXmlData;
}

const normalizeFileName = (name: string) => {
    const nextName = name.replace(/^\/+/, '');
    if (/.xml$/.test(nextName)) {
        return nextName;
    }

    return `${nextName}.xml`;
};

export function read(directoryPath: string, fileName: string): EventsDataXml {
    const filePath = `${directoryPath}\\${normalizeFileName(fileName)}`;
    const [accessError] = run<void, NodeError>(fs.accessSync, filePath, fs.constants.R_OK | fs.constants.W_OK);
    ensure(
        !accessError,
        accessError?.message ?? 'No such file or directory',
        accessError?.code ?? ErrorCodes.ENOENT_FILE,
    );

    const content = readFileSync(filePath);
    const [parseError, xmlData] = run<EventsDataXml, NodeError>(XML.parse, content);
    ensure(!parseError, parseError?.message ?? 'Unable to parse language_data.xml', ErrorCodes.EINVAL_XML_DATA);

    return xmlData;
}

export function write(directoryPath: string, fileName: string, content: EventsDataXml) {
    const [accessError] = run<void, NodeError>(fs.accessSync, directoryPath, fs.constants.R_OK | fs.constants.W_OK);
    ensure(!accessError, accessError?.message ?? 'Permission denied', accessError?.code ?? ErrorCodes.ENOENT_FILE);

    const filePath = `${directoryPath}\\${normalizeFileName(fileName)}`;
    const fileContent = XML.stringify<EventsDataXml>(content);

    const [writeError] = run<void, NodeError>(fs.writeFileSync, filePath, fileContent, 'utf8');
    ensure(!writeError, writeError?.message ?? 'Permission denied', writeError?.code ?? ErrorCodes.EACCES_FILE);
}
