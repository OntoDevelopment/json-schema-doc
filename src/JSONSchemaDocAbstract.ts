/**
 * @description Abstract class for generating documentation from JSON Schema.
 * @author Brian Wendt <brianwendt@users.noreply.github.com>
 * @link https://github.com/BrianWendt/json-schema-md-doc
 * @module JSONSchemaDocAbstract
 */

abstract class JSONSchemaDocAbstract {
    schema: Schema | null = null;
    response: string = "";
    errors: string[] = [];
    pathDivider: string = "/";

    constructor(schema?: Schema | string, options?: object) {
        if (schema) {
            this.load(schema);
        }
        if (options) {
            this.setOptions(options);
        }
    }

    load(schema: Schema | string): JSONSchemaDocAbstract {
        this.errors = [];
        if (typeof schema === "string") {
            try {
                this.schema = JSON.parse(schema);
            } catch (e) {
                this.error('invalid json: ' + (e as Error).message);
            }
        } else {
            this.schema = schema;
        }
        return this;
    }

    setOptions(options: object): JSONSchemaDocAbstract {
        Object.assign(this, options);
        return this;
    }

    generate(): string {
        this.response = "";
        if (this.errors.length < 1) {
            try {
                this.generateChildren("", this.schema!, 0, "#");
            } catch (e) {
                this.error((e as Error).toString());
            }
        }
        return this.generateResponse();
    }

    generateResponse(): string {
        if (this.errors.length > 0) {
            return this.errors.join("\n");
        } else {
            return this.response;
        }
    }

    generateChildren(name: string, data: Schema, level: number, path: string): void {
        if (typeof data?.$id === "string") {
            path = "#" + data.$id;
        }
        this.determineType(data);
        this.typeGeneric(name, data, level, path);

        data.type.forEach(type => {
            this.getTypeMethod(type)(name, data, level, path);
        });
        if (typeof data.definitions === "object" && Object.keys(data.definitions).length > 0) {
            path += "/definitions";
            this.writeHeader("definitions", level, path);
            for (const term in data.definitions) {
                const defPath = path + this.pathDivider + term;
                this.writeTerm(term, level);
                this.generateChildren(term, data.definitions[term], level + 1, defPath);
            }
        }
    }

    /**
     * @see https://json-schema.org/understanding-json-schema/reference/type
     */
    determineType(data: Schema): string[] {
        if (typeof data.type === "string") {
            data.type = [data.type];
            return data.type;
        } else if (Array.isArray(data.type)) {
            return data.type;
        }
        data.type = [];
        if (this.hasAnyProperty(data, ['items', 'additionalItems', 'minItems', 'maxItems', 'uniqueItems', 'contains'])) {
            data.type.push('array');
        }
        if (this.hasAnyProperty(data, ['minimum', 'maximum', 'exclusiveMinimum', 'exclusiveMaximum', 'multipleOf'])) {
            data.type.push('number');
        }
        if (this.hasAnyProperty(data, ['required', 'properties', 'additionalProperties', 'patternProperties', 'minProperties', 'maxProperties', 'propertyNames', 'dependencies'])) {
            data.type.push('object');
        }
        if (this.hasAnyProperty(data, ['maxLength', 'minLength', 'pattern', 'format'])) {
            data.type.push('string');
        }

        return data.type;
    }

    hasProperty(data: Schema, prop: string): boolean {
        return Object.prototype.hasOwnProperty.call(data, prop);
    }

    hasAnyProperty(data: Schema, props: string[]): boolean {
        return props.some(prop => this.hasProperty(data, prop));
    }

    typeGeneric(name: string, data: Schema, level: number, path: string): void {
        this.writeHeader(data.title, level, path);
        this.writeDescription(data.description, level, path);
        this.writeType(data.type, level, path);
        this.writePath(level, path);
        this.writeSchema(data.$schema, level);
        this.writeRef(data.$ref, level);
        this.writeId(data.$id, level, path);
        this.writeComment(data.$comment, level, path);
        this.writeExamples(data.examples, level, path);
        this.writeEnum(data.enum, level);
        this.writeDefault(data.default, level, path);
        this.writeConst(data.const, level);
        this.writeConditionalIf(data.if, level);
        this.writeConditionalThen(data.then, level);
        this.writeConditionalElse(data.else, level);
        this.writeContentEncoding(data.contentEncoding, level);
        this.writeContentMediaType(data.contentMediaType, level);
    }

    typeArray(name: string, data: Schema, level: number, path: string): void {
        this.writeAdditionalItems(data.additionalItems, level);
        this.writeItemsMinMax(data.minItems, data.maxItems, level);

        if (this.notEmpty(data.items)) {
            this.writeSectionName("Items", level + 1, path + "/items");
            if (Array.isArray(data.items)) {
                data.items.forEach(item => {
                    this.generateChildren('item', item, level + 1, path + "/items");
                });
            } else if (this.notEmpty(data.items) && typeof data.items === "object") {
                this.generateChildren('item', data.items, level + 1, path + "/items");
            }
        }
        this.writeContains(data.contains, level);
    }

    typeBoolean(name: string, data: Schema, level: number, path: string): void {
        // Implement typeBoolean logic if needed
    }

    typeNull(name: string, data: Schema, level: number, path: string): void {
        // Implement typeNull logic if needed
    }

    typeNumber(name: string, data: Schema, level: number, path: string): void {
        this.writeMinimumMaximum(data.minimum, data.maximum, level);
        this.writeExclusiveMinimumMaximum(data.exclusiveMinimum, data.exclusiveMaximum, level);
        this.writeMultipleOf(data.multipleOf, level);
    }

    typeString(name: string, data: Schema, level: number, path: string): void {
        this.writeFormat(data.format, level);
        this.writePattern(data.pattern, level);
        this.writeMinMaxLength(data.minLength, data.maxLength, level);
    }

    typeObject(name: string, data: Schema, level: number, path: string): void {
        this.writeUniqueItems(data.uniqueItems, level);
        const required = data.required ?? [];
        const properties = data.properties || {};
        this.writeAdditionalProperties(data.additionalProperties, level);
        this.writeMinMaxProperties(data.minProperties, data.maxProperties, level);

        this.writePropertyNames(data.propertyNames, level);
        this.writeSectionName("Properties", level, path);
        path += "/properties";
        for (const propName in properties) {
            const propPath = path + this.pathDivider + propName;
            const property = properties[propName];
            const isRequired = required.includes(propName);
            this.writePropertyName(propName, level + 1, propPath, isRequired);
            this.generateChildren(propName, property, level + 2, propPath);
        }
        this.writeDependencies(data.dependencies, level);
    }

    typeUnknown(name: string, data: Schema, level: number, path: string): void {
        // do nothing, this is okay
    }

    abstract writeAdditionalItems(bool: boolean | undefined, level: number): this

    abstract writeItemsMinMax(min: number | undefined, max: number | undefined, level: number): this

    abstract writeAdditionalProperties(bool: boolean | undefined, level: number): this

    abstract writeMinMaxProperties(min: number | undefined, max: number | undefined, level: number): this

    abstract writeComment(comment: string | undefined, level: number, path: string): this

    abstract writeConst(constant: any, level: number): this

    abstract writeConditionalIf(ifSchema: Schema | undefined, level: number): this

    abstract writeConditionalThen(thenSchema: Schema | undefined, level: number): this

    abstract writeConditionalElse(elseSchema: Schema | undefined, level: number): this

    abstract writeContentEncoding(contentEncoding: string | undefined, level: number): this

    abstract writeContentMediaType(contentMediaType: string | undefined, level: number): this

    abstract writeContains(contains: Schema | undefined, level: number): this

    abstract writeDefault(value: any, level: number, path: string): this

    abstract writeDescription(description: string | undefined, level: number, path: string): this

    abstract writeDependencies(dependencies: any, level: number): this

    abstract writeEnum(list: any[] | undefined, level: number): this

    abstract writeFormat(format: string | undefined, level: number): this

    abstract writeExamples(list: any[] | undefined, level: number, path: string): this

    abstract writeHeader(header: string | undefined, level: number, path?: string): this

    abstract writeId(id: string | undefined, level: number, path?: string): this

    abstract writeList(list: any[], level: number): this

    abstract writeMinimumMaximum(min: number | undefined, max: number | undefined, level: number): this

    abstract writeExclusiveMinimumMaximum(min: number | undefined, max: number | undefined, level: number): this

    abstract writeMultipleOf(number: number | undefined, level: number): this

    abstract writePattern(pattern: string | undefined, level: number): this

    abstract writeMinMaxLength(min: number | undefined, max: number | undefined, level: number): this

    abstract writePropertyNames(data: Schema | undefined, level: number): this

    abstract writePropertyName(prop: string, level: number, path: string, required: boolean): this

    abstract writeRef(ref: string | undefined, level: number): this

    abstract writePath(level: number, path: string): this

    abstract writeSchema(uri: string | undefined, level: number): this

    abstract writeSectionName(name: string, level: number, path?: string): this

    abstract writeTerm(term: string, level: number): this

    abstract writeType(type: string | string[] | undefined, level: number, path: string): this

    abstract writeUniqueItems(bool: boolean | undefined, level: number): this

    getTypeMethod(type: string): (name: string, data: Schema, level: number, path: string) => void {
        switch (type.toLowerCase()) {
            case "string":
                return this.typeString.bind(this);
            case "integer":
            case "number":
                return this.typeNumber.bind(this);
            case "object":
                return this.typeObject.bind(this);
            case "array":
                return this.typeArray.bind(this);
            case "boolean":
                return this.typeBoolean.bind(this);
            case "null":
                return this.typeNull.bind(this);
            default:
                return this.typeUnknown.bind(this);
        }
    }


    valueMinMax(min: number | undefined, max: number | undefined): string {
        if (this.notEmpty(min) && this.notEmpty(max)) {
            return "between " + min + " and " + max + "\n";
        } else if (this.notEmpty(min)) {
            return " &ge; " + min + "\n";
        } else if (this.notEmpty(max)) {
            return " &le; " + max + "\n";
        }
        return "";
    }

    valueMinMaxExclusive(min: number | undefined, max: number | undefined): string {
        let response = "";
        if (this.notEmpty(min)) {
            response += " > " + min + "\n";
        }
        if (this.notEmpty(min) && this.notEmpty(max)) {
            response += " & ";
        }
        if (this.notEmpty(max)) {
            response += " < " + max + "\n";
        }
        return response;
    }

    valueBool(bool: boolean | string): string {
        if (typeof bool === "string") {
            return bool;
        } else {
            return (bool) ? "true" : "false";
        }
    }

    valueFormat(value: any): string {
        if (typeof value === "boolean") {
            return this.valueBool(value);
        }
        else if (typeof value === "string") {
            return '"' + value + '"';
        }
        else {
            return value;
        }
    }

    refLink(ref: string): string {
        if (ref[0] !== '#' && ref.substring(0, 4).toLowerCase() !== "http") {
            ref = '#' + this.slugify(ref);
        }
        return ref;
    }

    escapeLink(value: string): string {
        return value.replace('$', '\\$'); //$ in [] breaks markdown 
    }

    slugify(string: string): string {
        return string.toString().toLowerCase()
            .replace(/\s+/g, '-') // Replace spaces with -
            .replace(/_/g, '-') // Replace _ with -
            .replace(/&/g, '-and-') // Replace & with "-and-"
            .replace(/[^a-zA-Z0-9-.]+/g, '') // Remove all non-word characters
            .replace(/--+/g, '-') // Replace multiple - with single -
            .replace(/^-+/, '') // Trim - from start of text
            .replace(/-+$/, ''); // Trim - from end of text
    }

    /**
     * @description Check if a value is empty (undefined, null, empty string, or empty array).
     */
    empty(value: any): boolean {
        return typeof value === "undefined"
            || value === null
            || (typeof value === "string" && value.length < 1)
            || (Array.isArray(value) && value.length < 1);
    }

    notEmpty(value: any): boolean {
        return !this.empty(value);
    }

    error(error: string): this {
        this.errors.push(error);
        return this;
    }
}

export default JSONSchemaDocAbstract;
