import Exception from '@kabeep/exception';

/**
 * Custom error class that extends the built-in `Error` class.
 * This class adds an error code to distinguish different types of errors.
 *
 * @extends Error
 *
 * @param {string} message - The error message.
 * @param {NodeJS.ErrnoException['code']} [code='EUNKNOWN'] - The error code. Defaults to 'EUNKNOWN' if not provided.
 */
class NodeError extends Exception {
    /**
     * Creates an instance of `NodeError`.
     *
     * @param {string} message - The error message.
     * @param {NodeJS.ErrnoException['code']} [code='EUNKNOWN'] - The error code. Defaults to 'EUNKNOWN'.
     */
    constructor(
        message: string | Error,
        public code: NodeJS.ErrnoException['code'] = 'EUNKNOWN',
    ) {
        super(message, 'black.bgRed');
    }
}

export default NodeError;
