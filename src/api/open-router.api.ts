import { iso6391X } from '@kabeep/node-translate';
import { osLocaleSync } from 'os-locale';
import chunk from 'lodash.chunk';
import { ErrorCodes } from '../shared/index.js';
import { ensure, to } from '../utils/index.js';
import post from './_internal/post.js';

interface ModelResponse {
    /** ID of the generated response */
    id: string;
    /** Model name used for the response */
    model: string;
    /** Type of object, typically 'chat.completion' */
    object: string;
    /** Unix timestamp of when the response was created */
    created: number;
    choices: Array<{
        /** Log probabilities of the generated tokens (can be null) */
        logprobs: undefined | any;
        /** Reason for stopping ('stop', 'length', etc.) */
        finish_reason: string;
        /** The index of this choice in the list of completions */
        index: number;
        message: {
            /** Role of the message ('assistant', 'user', etc.) */
            role: 'assistant' | 'user' | string;
            /** The actual content of the generated message */
            content: string;
            /** Additional info if there was a refusal or null */
            refusal: string;
        };
    }>;
    usage: {
        /** Number of tokens in the prompt */
        prompt_tokens: number;
        /** Number of tokens in the completion */
        completion_tokens: number;
        /** Total tokens used (prompt + completion) */
        total_tokens: number;
    };
}

export type OpenRouterModel =
    | 'meta-llama/llama-3.1-8b-instruct:free'
    | 'meta-llama/llama-3-8b-instruct:free'
    | 'huggingfaceh4/zephyr-7b-beta:free'
    | 'google/gemma-2-9b-it:free'
    | 'qwen/qwen-2-vl-7b-instruct:free'
    | 'qwen/qwen-2-7b-instruct:free';

export async function send(key: string, model: OpenRouterModel, message?: string) {
    ensure(key, 'Invalid OpenRouter API key', ErrorCodes.EINVAL_MODEL_KEY);

    if (!message) {
        return message;
    }

    const [error, response] = await to<ModelResponse>(
        post(
            'https://openrouter.ai/api/v1/chat/completions',
            {
                model,
                messages: [{ role: 'user', content: message }],
            },
            {
                headers: {
                    Authorization: `Bearer ${key}`,
                    'Content-Type': 'application/json',
                },
            },
        ),
    );
    ensure(!error, error?.message ?? 'Can not request to OpenRouter API', ErrorCodes.ECONNREFUSED_MODEL_RESP);

    const answer = response?.choices?.[0]?.message?.content;
    ensure(answer, 'Can not parse message for OpenRouter API', ErrorCodes.EINVAL_MODEL_RESP);

    return answer;
}

export async function locale(key: string, model: OpenRouterModel, message?: string) {
    ensure(key, 'Invalid OpenRouter API key', ErrorCodes.EINVAL_MODEL_KEY);

    if (!message) {
        return message;
    }

    const isoCode = osLocaleSync();
    const language = iso6391X.getName(isoCode.split('-')[0]);

    const sendMessage = `Use ${language} and ${message}`;

    return send(key, model, sendMessage);
}

export async function batch(key: string, model: OpenRouterModel, prompt: string, texts: string[]) {
    if (texts.length === 0) return [];

    const separator = '|||';
    const chunkSize = 25;
    const parts = chunk(texts, chunkSize);

    const result: string[] = [];
    for (const part of parts) {
        const original = part.join(separator);
        const message = `${prompt}\n\n${original}`;
        const response = await send(key, model, message);
        ensure(response, 'Can not parse message for OpenRouter API', ErrorCodes.EINVAL_MODEL_RESP);

        const translations = response.replace(/\n/g, '').split('|||');
        const normalizeTranslations = translations.map((item) => item.replace(/^\s+|\s+$/g, ''));

        result.push(...normalizeTranslations);
    }

    return result;
}
