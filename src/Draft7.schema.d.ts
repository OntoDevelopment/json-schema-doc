/**
 * JSON Schema - Draft 7
 */
declare interface Schema {
    $id?: string;
    $schema?: string;
    $ref?: string;
    $comment?: string;
    title?: string;
    description?: string;
    default?: any;
    readOnly?: boolean;
    writeOnly?: boolean;
    examples?: any[];
    multipleOf?: number;
    maximum?: number;
    exclusiveMaximum?: number;
    minimum?: number;
    exclusiveMinimum?: number;
    maxLength?: number;
    minLength?: number;
    pattern?: string;
    additionalItems?: boolean;
    items?: Schema | Schema[];
    maxItems?: number;
    minItems?: number;
    uniqueItems?: boolean;
    contains?: Schema; // not supported
    maxProperties?: number;
    minProperties?: number;
    required?: string[];
    additionalProperties?: boolean;
    definitions?: { [key: string]: Schema };
    properties?: { [key: string]: Schema };
    patternProperties?: { [key: string]: Schema }; // not supported
    dependencies?: { [key: string]: Schema | string[] }; // not supported
    propertyNames?: Schema;
    const?: any; // not supported
    enum?: any[];
    type: string[];
    format?: string;
    contentMediaType?: string; // not supported
    contentEncoding?: string; // not supported
    if?: Schema; // not supported
    then?: Schema; // not supported
    else?: Schema; // not supported
    allOf?: Schema[]; // not supported
    anyOf?: Schema[]; // not supported
    oneOf?: Schema[]; // not supported
    not?: Schema; // not supported
}
