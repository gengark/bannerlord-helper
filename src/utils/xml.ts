import {
    type ValidationError,
    type validationOptions as ValidationOptions,
    type X2jOptions as XMLParserOptions,
    XMLBuilder,
    type XmlBuilderOptions,
    XMLParser,
    XMLValidator,
} from 'fast-xml-parser';

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface XMLHandlerOptions {
    parserOptions?: XMLParserOptions;
    builderOptions?: XmlBuilderOptions;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export class XMLHandler {
    private readonly builder: XMLBuilder;
    private readonly parser: XMLParser;

    constructor(options: XMLHandlerOptions = {}) {
        this.parser = new XMLParser(options.parserOptions);
        this.builder = new XMLBuilder(options.builderOptions);
    }

    /**
     * Converts a JavaScript object to an XML string.
     * @param {object} value - The object to convert to XML.
     * @returns {string} The XML representation of the object.
     */
    stringify<T extends object>(value: T): string {
        return this.builder.build(value) as string;
    }

    /**
     * Validates an XML string against the specified options.
     * @param {string} content - The XML content to validate.
     * @param {ValidationOptions} options - Optional validation options.
     * @returns {true | ValidationError} True if valid, or a ValidationError object if invalid.
     */
    validate(content: string, options?: ValidationOptions): true | ValidationError {
        return XMLValidator.validate(content, options);
    }

    /**
     * Parses an XML string or buffer into a JavaScript object.
     * @param {string | Uint8Array} content - The XML content to parse.
     * @param {ValidationOptions} validationOptions - Optional validation options or a boolean to enable validation.
     * @returns {object} The parsed JavaScript object.
     */
    parse<T extends object>(content: string | Buffer, validationOptions?: ValidationOptions | boolean): T {
        return this.parser.parse(content, validationOptions) as T;
    }
}

// eslint-disable-next-line @typescript-eslint/naming-convention
const XML = new XMLHandler({
    parserOptions: {
        ignoreAttributes: false,
        allowBooleanAttributes: true,
    },

    builderOptions: {
        ignoreAttributes: false,
        format: true,
        suppressBooleanAttributes: false,
        suppressEmptyNode: true,
    },
});

export default XML;

export {
    type validationOptions as ValidationOptions,
    type XmlBuilderOptions,
    type X2jOptions as XMLParserOptions,
} from 'fast-xml-parser';
