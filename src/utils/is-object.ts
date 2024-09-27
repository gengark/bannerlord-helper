function isObject<T extends object>(value: unknown): value is T {
    return Object.prototype.toString.call(value) === '[object Object]';
}

export default isObject;
