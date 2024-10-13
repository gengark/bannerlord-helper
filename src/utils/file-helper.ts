import fs from 'node:fs';
import path from 'node:path';
import iconv from 'iconv-lite';
import NodeError from './node-error';
import op from './op';

export type BufferEncodingExpand = BufferEncoding | 'utf-16be';

/**
 * Detects the file encoding based on the Byte Order Mark (BOM).
 * @param filePath - The path to the file whose encoding is to be detected.
 * @returns The detected encoding ('utf8', 'utf-16le', 'utf-16be').
 * If no BOM is present, it assumes 'utf8'.
 * @example
 *
 * const encoding = detectEncoding('/path/to/file.txt'); // 'utf8', 'utf-16le', or 'utf-16be'
 */
function detectEncoding(filePath: string): BufferEncodingExpand {
    const fd = fs.openSync(filePath, 'r'); // Open file in read-only mode
    const buffer = Buffer.alloc(3); // Allocate 3 bytes to read the file header
    fs.readSync(fd, buffer, 0, 3, 0); // Read the first 3 bytes from the file
    fs.closeSync(fd); // Close the file after reading

    if (buffer[0] === 0xef && buffer[1] === 0xbb && buffer[2] === 0xbf) {
        return 'utf8';
    }

    if (buffer[0] === 0xff && buffer[1] === 0xfe) {
        return 'utf-16le';
    }

    if (buffer[0] === 0xfe && buffer[1] === 0xff) {
        return 'utf-16be';
    }

    // Assume 'utf8' if no BOM is found
    return 'utf8';
}

/**
 * Checks if the encoding is a valid `BufferEncoding` supported by Node.js.
 * @param encoding - The encoding to check.
 * @returns True if the encoding is supported by Node.js' filesystem methods.
 */
function isFsSupportedEncoding(encoding: BufferEncodingExpand): encoding is BufferEncoding {
    const supportedEncodings: BufferEncoding[] = [
        'ascii',
        'utf8',
        'utf-8', // eslint-disable-line unicorn/text-encoding-identifier-case
        'utf16le',
        'utf-16le',
        'ucs2',
        'ucs-2',
        'base64',
        'base64url',
        'latin1',
        'binary',
        'hex',
    ];
    return supportedEncodings.includes(encoding as BufferEncoding);
}

/**
 * Reads a file and returns its content as a string, automatically detecting the file's encoding.
 * If the encoding is unsupported by Node.js, it uses `iconv-lite` to decode the file.
 * @param filePath - The path to the file to read.
 * @returns The file content as a string.
 * @throws Error - error if reading the file fails.
 * @example
 *
 * const filepath = '/path/to/file.txt'; // UTF-16 Be encoding
 * const content = readFileSync();
 */
export function readFile(filePath: string): string {
    const encoding = detectEncoding(filePath);

    try {
        if (isFsSupportedEncoding(encoding)) {
            return fs.readFileSync(filePath, { encoding });
        }

        const buffer = fs.readFileSync(filePath);
        return iconv.decode(buffer, encoding);
    } catch (error: unknown) {
        throw new NodeError(error as Error, (error as NodeError)?.code);
    }
}

export function clearDirectoryFile(directoryPath: string, extension?: string) {
    try {
        const files = fs.readdirSync(directoryPath);

        for (const file of files) {
            const filePath = path.join(directoryPath, file);
            const isDeletableFile =
                fs.statSync(filePath).isFile() && (!extension || file.split('.').pop() === extension);
            if (isDeletableFile) fs.unlinkSync(filePath);
        }
    } catch (error: unknown) {
        throw new NodeError(error as Error, (error as NodeError)?.code);
    }
}

export function ensureDirectory(directoryPath: string): string {
    try {
        const isExisted = pathExist(directoryPath);
        if (isExisted) return directoryPath;

        return fs.mkdirSync(directoryPath, { recursive: true })!;
    } catch (error: unknown) {
        throw new NodeError(error as Error, (error as NodeError)?.code);
    }
}

export function pathExist(filepath: string) {
    const [error] = op(fs.accessSync, filepath, fs.constants.R_OK);
    return !error;
}

export function readdirFiles(directoryPath: string, options: { extensions?: string[]; recursive?: boolean } = {}) {
    const files = fs.readdirSync(directoryPath, { withFileTypes: true, recursive: options.recursive });

    const result: string[] = [];
    for (const file of files) {
        if (!file.name || !file.isFile?.()) continue;

        const fileExtension = file.name.split('.').pop();
        if (!fileExtension || !options.extensions?.includes(fileExtension)) continue;

        result.push(file.name);
    }

    return result;
}
