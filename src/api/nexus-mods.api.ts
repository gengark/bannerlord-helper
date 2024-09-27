import get from './_internal/get.js';

const BASE_URL = 'https://www.nexusmods.com/';
const BASE_API_URL = 'https://api.nexusmods.com/';
const BASE_STATIC_URL = 'https://staticdelivery.nexusmods.com/';
// Game ID of `Mount and Blade II: Bannerlord`
const NEXUS_MODS_GAME_ID = 3174;

function getUrl(baseUrl: string, pathname?: string) {
    return pathname ? new URL(pathname, baseUrl).href : new URL(baseUrl).href;
}

interface SearchResponseOption {
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
    results: SearchResultOption[];
}

interface SearchResultOption {
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

const searchRemapping = (option: SearchResultOption) => ({
    uuid: option.mod_id,
    name: option.name,
    author: { id: option.user_id, name: option.username },
    url: getUrl(BASE_URL, option.url),
    thumbnail: getUrl(BASE_STATIC_URL, option.image),
    downloads: `${option.downloads}`,
    endorsements: `${option.endorsements}`,
    isAdult: option.adult,
    nativeName: '',
    description: '',
});

export type NexusModsOption = ReturnType<typeof searchRemapping>;

export async function search(keywords: string | string[]): Promise<NexusModsOption[]> {
    const terms = Array.isArray(keywords) ? keywords.join(',') : keywords;
    const gameId = `${NEXUS_MODS_GAME_ID}`;
    const blockedAuthors = '';
    const blockedTags = '';
    const includeAdult = '1';

    const response = await get<SearchResponseOption>(getUrl(BASE_API_URL, 'mods'), {
        terms,
        gameId,
        blockedAuthors,
        blockedTags,
        includeAdult,
    });

    return response.results.map(searchRemapping);
}
