function pipe<R1, R2>(
    function1: (...arguments_: any[]) => R1,
    function2: (argument: R1) => R2,
): (...arguments_: any[]) => R2;

function pipe<R1, R2, R3>(
    function1: (...arguments_: any[]) => R1,
    function2: (argument: R1) => R2,
    function3: (argument: R2) => R3,
): (...arguments_: any[]) => R3;

function pipe<R1, R2, R3, R4>(
    function1: (...arguments_: any[]) => R1,
    function2: (argument: R1) => R2,
    function3: (argument: R2) => R3,
    function4: (argument: R3) => R4,
): (...arguments_: any[]) => R4;

function pipe<R1, R2, R3, R4, R5>(
    function1: (...arguments_: any[]) => R1,
    function2: (argument: R1) => R2,
    function3: (argument: R2) => R3,
    function4: (argument: R3) => R4,
    function5: (argument: R4) => R5,
): (...arguments_: any[]) => R5;

function pipe<R1, R2, R3, R4, R5, R6>(
    function1: (...arguments_: any[]) => R1,
    function2: (argument: R1) => R2,
    function3: (argument: R2) => R3,
    function4: (argument: R3) => R4,
    function5: (argument: R4) => R5,
    function6: (argument: R5) => R6,
): (...arguments_: any[]) => R6;

function pipe(
    function1: (...arguments_: any[]) => any,
    ...fns: Array<(argument: any) => any>
): (...arguments_: any[]) => any;

/**
 * Composes a sequence of functions, passing the result of each function to the next.
 * @param function1 - The first function to apply.
 * @param fns - Additional functions to compose.
 * @returns A new function that represents the composition of the provided functions.
 * @see [lodash.flow]{@link https://github.com/lodash/lodash/blob/main/src/flow.ts}
 *
 * @example
 *
 * const add = (a: number, b: number) => a + b;
 * const square = (n: number) => n * n;
 * const addSquare = pipe(add, square);
 * // => 9
 * addSquare(1, 2);
 */
function pipe(
    function1: (...arguments_: any[]) => any,
    ...fns: Array<(argument: any) => any>
): (...arguments_: any[]) => any {
    return function (this: any, ...arguments_: any[]): any {
        /* eslint-disable unicorn/no-array-reduce, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument */
        return fns.reduce(
            (previousR, function_) => function_.call(this, previousR),
            function1.call(this, ...arguments_),
        );
        /* eslint-enable unicorn/no-array-reduce, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument */
    };
}

export default pipe;
