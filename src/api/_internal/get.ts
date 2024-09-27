import got, { type OptionsInit, type Response, type ResponseType } from 'got';
import merge from 'lodash.merge';
import snakeCase from 'lodash.snakecase';

export class GetUrl extends URL {
    constructor(url: string, record?: Record<string, string>) {
        super(url);

        if (record && Object.keys(record).length > 0) {
            for (const [key, value] of Object.entries(record)) {
                this.searchParams.append(snakeCase(key), value);
            }
        }
    }
}

async function get<T = any>(url: string, query?: Record<string, string>, record?: Record<string, string>): Promise<T>;
async function get<T = any>(
    url: string,
    query: Record<string, string>,
    record: Record<string, string>,
    type: 'buffer',
): Promise<Buffer>;
async function get<T = any>(
    url: string,
    query: Record<string, string>,
    record: Record<string, string>,
    type: 'text',
): Promise<string>;
async function get<T = any>(
    url: string,
    query: Record<string, string> = {},
    options: Record<string, unknown> = {},
    type: ResponseType = 'json',
) {
    const _url = new GetUrl(url, query).href;

    const response = (await got.get(
        _url,
        merge<OptionsInit, OptionsInit>(
            {
                headers: {
                    accept: '*/*',
                    'accept-language': 'zh-CN,zh;q=0.9',
                    priority: 'u=1, i',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"Windows"',
                },
                timeout: {
                    request: 30_000,
                },
                retry: {
                    limit: 0,
                },
                responseType: type,
            },
            options,
        ),
    )) as Response<T>;

    return response.body;
}

export default get;
