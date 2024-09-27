type SyncOrAsyncFunction = (...arguments_: any[]) => any;

export interface WorkflowHookOption {
    item: string;
    index: number;
}

/**
 * Executes an array of functions in sequence, with optional hooks
 * that run before and after each function.
 *
 * @param fns - An array of functions to execute in order.
 * @param hooks - Optional hooks to run before and after each function.
 * @param hooks.before - A hook to run before each function is executed.
 * @param hooks.after - A hook to run after each function is executed.
 * @returns A function that, when called, executes the functions in sequence.
 * @example
 *
 * // >>> Composes a series of functions (synchronous or asynchronous) from left to right.
 * const add = (a: number, b: number) => a + b;
 * const square = async (n: number) => n * n;
 * const addSquare = workflow([add, square]);
 * // => 9
 * await addSquare(1, 2);
 *
 * // >>> Composes a series of functions with Lifecycle
 * const fn1 = () => { console.log('I am fn1') }
 * const fn2 = () => { console.log('I am fn2') }
 * const execute = workflow([fn1, fn2], {
 *     before: (info) => console.log(`Before ${info.item}, step ${info.index}`),
 *     after: (info) => console.log(`After ${info.item}, step ${info.index}`),
 * });
 * // Before add, step 0
 * // I am fn1
 * // After add, step 0
 * // Before square, step 1
 * // I am fn2
 * // After square, step 1
 * // Done
 * execute().then(() => { console.log('Done') });
 */
function workflow<T = any>(
    fns: SyncOrAsyncFunction[],
    hooks?: {
        before?: (info: { item: string; index: number }) => void;
        after?: (info: { item: string; index: number }) => void;
    },
) {
    const { length } = fns;

    // Validate function types
    let i = length;
    while (i--) {
        if (typeof fns[i] !== 'function') {
            throw new TypeError('Expected a function');
        }
    }

    return async function (this: any, ...arguments_: any[]): Promise<T> {
        // Hook: Before executing the first function
        hooks?.before?.({ item: fns[0].name || 'anonymous', index: 0 });

        // Call the first function
        let result = length ? await fns[0].apply(this, arguments_) : arguments_[0];

        // Hook: After executing the first function
        hooks?.after?.({ item: fns[0].name || 'anonymous', index: 0 });

        let index = 1;
        while (index < length) {
            const function_ = fns[index];
            const functionName = function_.name || 'anonymous';

            // Hook: Before executing the current function
            hooks?.before?.({ item: functionName, index });

            // Call the current function
            result = await function_.call(this, result);

            // Hook: After executing the current function
            hooks?.after?.({ item: functionName, index });

            index++;
        }

        return result;
    };
}

export default workflow;
