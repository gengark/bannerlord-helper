import baseGetTag from './_internal/base-get-tag';

function isPlainObject<T extends object = object>(value: any): value is T {
    if (baseGetTag(value) !== '[object Object]') {
        return false;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const proto = Object.getPrototypeOf(value);
    if (proto === null) {
        return true;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const constructor = Object.hasOwn(proto as Record<string, unknown>, 'constructor') && proto.constructor;
    return (
        typeof constructor === 'function' &&
        constructor instanceof constructor &&
        Function.prototype.toString.call(Object) === Function.prototype.toString.call(constructor)
    );
}

export default isPlainObject;
