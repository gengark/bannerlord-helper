import { type Cheerio, load } from 'cheerio';
import { type NexusModsOption } from '../api/index.js';
import getRemotePage from './get-remote-page.js';

const getTextNode = (element: Cheerio<any>, selector?: string, defaultValue = '--') => {
    const purify = (string_: string) => string_.replace(/--|^[\s\n]*|[\s\n]*$/g, '');

    if (!selector) return purify(element.text()) || defaultValue;
    return purify(element.find(selector).text()) || defaultValue;
};

export type RemoteModuleOption<T> = T & {
    title: string;
    endorsements: string;
    uniqueDownloads?: string;
    totalDownloads: string;
    totalViews?: string;
    remoteVersion?: string;
    gallery?: string[];
    lastUpdated?: string;
    originalUpload?: string;
    createdBy?: string;
    uploadedBy?: string;
    virusScan?: string;
    tags?: string[];
    htmlContent?: string;
};

async function readRemoteModule<T extends Pick<NexusModsOption, 'url' | 'name' | 'endorsements' | 'downloads'>>(
    module: T,
): Promise<RemoteModuleOption<T>> {
    const html = await getRemotePage(module.url);

    const $ = load(html);

    const headerElement = $('#pagetitle');
    const title = getTextNode(headerElement, 'h1', module.name);
    const endorsements = getTextNode(headerElement, '.stat-endorsements .statitem .stat', module.endorsements);
    const uniqueDownloads = getTextNode(headerElement, '.stat-uniquedls .statitem .stat');
    const totalDownloads = getTextNode(headerElement, '.stat-totaldls .statitem .stat', module.downloads);
    const totalViews = getTextNode(headerElement, '.stat-totalviews .statitem .stat');
    const version = getTextNode(headerElement, '.stat-version .statitem .stat').replace(/^[ve]\.?/, '');
    // Console.log(title, endorsements, uniqueDownloads, totalDownloads, totalViews, version);

    const galleryElement = $('#sidebargallery');
    const thumbnails = galleryElement
        .find('.thumbgallery')
        .contents()
        .map((_, element) => {
            return $(element).attr('data-src');
        })
        .get();
    // Console.log(thumbnails);

    const fileInfoElement = $('#fileinfo');
    const lastUpdated = fileInfoElement.find('.sideitem:nth(0) > time').attr('datetime') || '--';
    const originalUpload = fileInfoElement.find('.sideitem:nth(1) > time').attr('datetime') || '--';
    const createdBy = getTextNode(fileInfoElement, '.sideitem:nth(2)').replace('Created by\n', '');
    const uploadedBy = getTextNode(fileInfoElement, '.sideitem:nth(3) > a');
    const virusScan = getTextNode(fileInfoElement, '.sideitem:nth(4) span');
    // Console.log(lastUpdated, originalUpload, createdBy, uploadedBy, virusScan);

    const tagElement = $('#section .info-details .side-tags ul.tags');
    const tags: string[] = [];
    tagElement.find('li').each((_, element) => {
        const label = $(element)
            .find('.flex-label')
            .text()
            ?.replace(/^[\n\s]|[\n\s]$/g, '');
        if (label) {
            tags.push(label);
        }
    });

    const container = $('.tabcontent-mod-page');
    const description = getTextNode(container, '.tab-description > p');
    const htmlContent = container.html() ?? '';

    return {
        ...module,
        title,
        endorsements,
        uniqueDownloads,
        totalDownloads,
        totalViews,
        remoteVersion: version,
        gallery: thumbnails,
        lastUpdated,
        originalUpload,
        createdBy,
        uploadedBy,
        virusScan,
        tags,
        description,
        htmlContent,
    };
}

export default readRemoteModule;
