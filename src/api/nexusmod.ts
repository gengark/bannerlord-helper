import { type Cheerio, load } from 'cheerio';
import ky from 'ky';
import words from 'lodash.words';
import { $t } from '../shared';
import { ensure, formatDate, to } from '../utils';

interface SearchResponseOptions {
    /** Search keywords */
    terms: string[];
    /** Exclude authors */
    exclude_authors: string[];
    /** Exclude tags */
    exclude_tags: string[];
    /** Enabled adult content */
    include_adult: boolean;
    /** Task time */
    took: number;
    /** Result total */
    total: number;
    /** Result info */
    results: SearchResultOptions[];
}

interface SearchResultOptions {
    /** Module ID */
    mod_id: number;
    /** Module name */
    name: string;
    /** Author ID */
    user_id: number;
    /** Author name */
    username: string;
    /** Game ID */
    game_id: number;
    /** Game name */
    game_name: string;
    /** Homepage pathname */
    url: string;
    /** Thumbnail pathname */
    image: string;
    /** Download count */
    downloads: string;
    /** Endorsements count */
    endorsements: string;
    /** Adult content */
    adult: boolean;
}

export type NexusmodModuleOptions = ReturnType<typeof nexusmodOptionVO>;

/* eslint-disable @typescript-eslint/naming-convention */
const BASE_URL = 'https://www.nexusmods.com/';
const BASE_API_URL = 'https://api.nexusmods.com/';
const BASE_STATIC_URL = 'https://staticdelivery.nexusmods.com/';
// Game ID of `Mount and Blade II: Bannerlord`
const NEXUS_MODS_GAME_ID = 3174;
/* eslint-enable @typescript-eslint/naming-convention */

function buildUrl(baseUrl: string, pathname?: string): string {
    return pathname ? new URL(pathname, baseUrl).href : new URL(baseUrl).href;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
const nexusmodOptionVO = (option: SearchResultOptions) => ({
    id: option.mod_id,
    name: option.name,
    author: { id: option.user_id, name: option.username },
    url: buildUrl(BASE_URL, option.url),
    thumbnail: buildUrl(BASE_STATIC_URL, option.image),
    downloads: `${option.downloads}`,
    endorsements: `${option.endorsements}`,
    isAdult: option.adult,
});

const client = ky.create({
    prefixUrl: BASE_API_URL,
    headers: {
        accept: '*/*',
        'accept-language': 'zh-CN,zh;q=0.9',
        priority: 'u=1, i',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
    },
});

export async function getModules(keywords: string | string[]): Promise<NexusmodModuleOptions[]> {
    ensure(keywords, $t('EINVAL_MISSING_KEYWORDS'), 'EINVAL_MISSING_KEYWORDS');

    const [error, response] = await to<SearchResponseOptions>(
        client
            .get<SearchResponseOptions>('mods', {
                searchParams: {
                    terms: Array.isArray(keywords) ? keywords.join(',') : words(keywords).join(','),
                    /* eslint-disable @typescript-eslint/naming-convention */
                    game_id: NEXUS_MODS_GAME_ID,
                    blocked_authors: '',
                    blocked_tags: '',
                    include_adult: '1',
                    /* eslint-enable @typescript-eslint/naming-convention */
                },
            })
            .json(),
    );
    ensure(!error && response, error?.message, 'EINVAL_NEXUSMOD_RESPONSE');

    return response.results.map((item) => nexusmodOptionVO(item));
}

export type ModulePageOptions = ReturnType<typeof modulePageOptionVO>;

// eslint-disable-next-line @typescript-eslint/naming-convention
function modulePageOptionVO(html: string) {
    const $ = load(html);

    const getTextNode = (element: Cheerio<any>, selector?: string, defaultValue?: string) => {
        const purify = (string_: string) => string_.replace(/--|^[\s\n]*|[\s\n]*$/g, '');

        if (!selector) return purify(element.text()) || defaultValue;
        // eslint-disable-next-line unicorn/no-array-callback-reference
        return purify(element.find(selector).text()) || defaultValue;
    };

    const headerElement = $('#pagetitle');
    const title = getTextNode(headerElement, 'h1');
    const endorsements = getTextNode(headerElement, '.stat-endorsements .statitem .stat');
    const uniqueDownloads = getTextNode(headerElement, '.stat-uniquedls .statitem .stat');
    const totalDownloads = getTextNode(headerElement, '.stat-totaldls .statitem .stat');
    const totalViews = getTextNode(headerElement, '.stat-totalviews .statitem .stat');
    const version = getTextNode(headerElement, '.stat-version .statitem .stat')?.replace(/^[ve]\.?/, '');

    const galleryElement = $('#sidebargallery');
    const thumbnails = galleryElement
        .find('.thumbgallery')
        .contents()
        .map((_, element) => {
            return $(element).attr('data-src');
        })
        .get();

    const fileInfoElement = $('#fileinfo');
    const lastUpdated = fileInfoElement.find('.sideitem:nth(0) > time').attr('datetime');
    const originalUpload = fileInfoElement.find('.sideitem:nth(1) > time').attr('datetime');
    const createdBy = getTextNode(fileInfoElement, '.sideitem:nth(2)')?.replace('Created by\n', '');
    const uploadedBy = getTextNode(fileInfoElement, '.sideitem:nth(3) > a');
    const virusScan = getTextNode(fileInfoElement, '.sideitem:nth(4) span');

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
        title,
        endorsements,
        uniqueDownloads,
        totalDownloads,
        totalViews,
        remoteVersion: version,
        gallery: thumbnails,
        lastUpdated: lastUpdated ? formatDate(`${lastUpdated}Z`) : undefined,
        originalUpload: originalUpload ? formatDate(`${originalUpload}Z`) : undefined,
        createdBy,
        uploadedBy,
        virusScan,
        tags,
        description,
        htmlContent,
    };
}

export async function getModulePage(id: string | number): Promise<ModulePageOptions> {
    const [error, response] = await to(ky.get(buildUrl(BASE_URL, `/mountandblade2bannerlord/mods/${id}`)).text());
    ensure(!error && response, error?.message, 'EINVAL_NEXUSMOD_RESPONSE');

    return modulePageOptionVO(response);
}
