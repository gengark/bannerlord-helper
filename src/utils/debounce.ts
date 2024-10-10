type FunctionType<T extends any[], R> = (...arguments_: T) => R;

interface DebounceSettings {
    /**
     * Specify invoking on the leading edge of the timeout.
     */
    leading?: boolean;
}

interface DebouncedFunction<T extends FunctionType<any[], any>> {
    (...arguments_: Parameters<T>): ReturnType<T>;
    cancel(): void;
    flush(): ReturnType<T>;
}

function debounce<T extends FunctionType<any[], any>>(
    function_: T,
    wait: number,
    { leading = false }: DebounceSettings = {},
): DebouncedFunction<T> {
    let result: any;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let lastThis: any;
    let lastArguments: any[] | undefined;

    function invokeFunction() {
        if (lastArguments !== undefined) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument
            result = function_.call(lastThis, ...lastArguments);
            timer = lastThis = lastArguments = undefined; // eslint-disable-line no-multi-assign
        }

        return result; // eslint-disable-line @typescript-eslint/no-unsafe-return
    }

    function debounced(this: any, ...arguments_: any[]) {
        // eslint-disable-next-line unicorn/no-this-assignment, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-this-alias
        lastThis = this;
        lastArguments = arguments_;
        if (leading && timer === undefined) {
            result = invokeFunction(); // eslint-disable-line @typescript-eslint/no-unsafe-assignment
        }

        if (timer) {
            clearTimeout(timer);
            timer = undefined;
        }

        timer = setTimeout(() => {
            result = invokeFunction(); // eslint-disable-line @typescript-eslint/no-unsafe-assignment
        }, wait);
        return result; // eslint-disable-line @typescript-eslint/no-unsafe-return
    }

    debounced.cancel = function () {
        if (timer !== undefined) {
            clearTimeout(timer);
        }

        timer = lastThis = lastArguments = undefined; // eslint-disable-line no-multi-assign
    };

    debounced.flush = function () {
        return timer === undefined ? result : invokeFunction(); // eslint-disable-line @typescript-eslint/no-unsafe-return
    };

    return debounced;
}

export default debounce;
