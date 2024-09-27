import { type validationOptions, XMLBuilder, XMLParser } from 'fast-xml-parser';

const parser = new XMLParser({ ignoreAttributes: false, allowBooleanAttributes: true });
const builder = new XMLBuilder({
    ignoreAttributes: false,
    format: true,
    suppressBooleanAttributes: false,
    suppressEmptyNode: true,
});

const XML = {
    parse<T>(...arguments_: [string | Buffer, (validationOptions | boolean)?]): T {
        return parser.parse.bind(parser, ...arguments_)();
    },
    stringify<T>(indexObject: T): string {
        return builder.build.bind(builder, indexObject)();
    },
};

export default XML;
