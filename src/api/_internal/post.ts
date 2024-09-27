import got, { type OptionsInit, type Response } from 'got';
import merge from 'lodash.merge';

async function post<T = any>(
    url: string,
    parameters: Record<string, unknown> = {},
    options: Record<string, unknown> = {},
) {
    const response = (await got.post(
        url,
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
                    request: 40_000,
                },
                retry: {
                    limit: 0,
                },
                json: parameters,
                responseType: 'json',
            },
            options,
        ),
    )) as Response<T>;

    return response.body;
}

export default post;
