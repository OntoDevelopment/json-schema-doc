/**
 * @description Converts JSON Schema to Markdown documentation.
 * @author Brian Wendt <brianwendt@users.noreply.github.com>
 * @link https://github.com/OntoDevelopment/json-schema-doc
 * @module JSONSchemaMarkdownDoc
 */

import JSONSchemaDocAbstract from "./JSONSchemaDocAbstract.js";

export default class JSONSchemaMarkdownDoc extends JSONSchemaDocAbstract {
    indentChar: string = "\t";
    pathDivider: string = "/";
    objectNotation: string = "&thinsp;.&thinsp;";
    footer: string = "\n_Generated with [json-schema-md-doc](https://brianwendt.github.io/json-schema-md-doc/)_";
    useHtml: boolean = true;
    emphasisChar: string = "*";

    generateResponse(): string {
        if (this.errors.length > 0) {
            return this.errors.join("\n");
        } else {
            this.response += this.footer;
            return this.response;
        }
    }

    writeAdditionalItems(bool: boolean | undefined, level: number = 1): this {
        if (this.empty(bool)) {
            return this;
        }
        if (bool) {
            return this.writeLine("This schema " + this.underline("does not") + " accept additional items.", level);
        } else {
            return this.writeLine("This schema accepts additional items.", level);
        }
    }

    writeItemsMinMax(min: number | undefined, max: number | undefined, level: number = 1): this {
        if (this.notEmpty(min) || this.notEmpty(max)) {
            this.writeLine("Item Count: " + this.valueMinMax(min, max), level);
        }
        return this;
    }

    writeAdditionalProperties(bool: boolean | undefined, level: number = 1): this {
        if (this.empty(bool)) {
            return this;
        }
        if (!bool) {
            return this.writeLine(
                "This schema " + this.underline("does not") + " accept additional properties.",
                level,
            );
        } else {
            return this.writeLine("This schema accepts additional properties.", level);
        }
    }

    writeMinMaxProperties(min: number | undefined, max: number | undefined, level: number = 1): this {
        if (this.notEmpty(min) || this.notEmpty(max)) {
            this.writeLine("Property Count: " + this.valueMinMax(min, max), level);
        }
        return this;
    }

    writeComment(comment: string | undefined, level: number = 1, path: string): this {
        if (this.empty(comment) || typeof comment !== "string") {
            return this;
        }
        const nl = this.useHtml ? "<br/>" : "\n";
        return this.writeLine(this.bold("Comment", path) + nl + this.italic(comment), level);
    }

    writeConst(constant: any, level: number = 1): this {
        if (this.notEmpty(constant)) {
            this.writeLine("Constant value: " + this.valueFormat(constant), level);
        }
        return this;
    }

    writeConditionalIf(schema: Schema | undefined, level: number = 1): this {
        if (this.notEmpty(schema)) {
            this.writeLine("If: ", level);
            this.generateChildren("if", schema!, level + 1, "");
        }
        return this;
    }

    writeConditionalThen(schema: Schema | undefined, level: number = 1): this {
        if (this.notEmpty(schema)) {
            this.writeLine("Then: ", level);
            this.generateChildren("then", schema!, level + 1, "");
        }
        return this;
    }

    writeConditionalElse(schema: Schema | undefined, level: number = 1): this {
        if (this.notEmpty(schema)) {
            this.writeLine("Else: ", level);
            this.generateChildren("else", schema!, level + 1, "");
        }
        return this;
    }

    writeContentEncoding(contentEncoding: string | undefined, level: number = 1): this {
        if (this.notEmpty(contentEncoding)) {
            this.writeLine("Content Encoding: " + contentEncoding, level);
        }
        return this;
    }

    writeContentMediaType(contentMediaType: string | undefined, level: number = 1): this {
        if (this.notEmpty(contentMediaType)) {
            this.writeLine("Content Media Type: " + contentMediaType, level);
        }
        return this;
    }

    writeContains(contains: Schema | undefined, level: number = 1): this {
        if (this.notEmpty(contains)) {
            this.writeLine("Contains: ", level);
            this.generateChildren("contains", contains!, level + 1, "");
        }
        return this;
    }

    writeDefault(value: any, level: number = 1, path: string): this {
        if (this.notEmpty(value)) {
            this.writeLine("Default: " + this.valueFormat(value), level);
        }
        return this;
    }

    writeDescription(description: string | undefined, level: number = 1, path: string): this {
        if (this.notEmpty(description) && typeof description === "string") {
            this.writeLine("_" + description.replace("\n", "<br>") + "_", level);
        }
        return this;
    }

    writeDependencies(dependencies: any, level: number = 1): this {
        if (this.notEmpty(dependencies)) {
            this.writeLine("Dependencies: ", level);
            this.writeList(Object.keys(dependencies), level + 1);
        }
        return this;
    }

    writeEnum(list: any[] | undefined, level: number = 1): this {
        if (this.notEmpty(list) && typeof list === "object") {
            this.writeLine("The value is restricted to the following: ", level);
            this.writeList(list, level + 1);
        }
        return this;
    }

    writeFormat(format: string | undefined, level: number = 1): this {
        if (this.notEmpty(format)) {
            this.writeLine('String format must be a "' + format + '"', level);
        }
        return this;
    }

    writeExamples(list: any[] | undefined, level: number = 1, path: string): this {
        if (this.notEmpty(list) && typeof list === "object") {
            this.writeLine("Example values: ", level);
            this.writeList(list, level + 1);
        }
        return this;
    }

    writeHeader(header: string | undefined, level: number = 1, path?: string): this {
        if (this.notEmpty(header)) {
            this.writeLine("#".repeat(Math.min(level + 1, 5)) + " " + header, level);
        }
        return this;
    }

    writeId(id: string | undefined, level: number = 1, path?: string): this {
        if (this.notEmpty(id) && typeof id === "string") {
            this.writeLine(this.bold("&#36;id: " + id, id), level);
        }
        return this;
    }

    writeList(list: any[], level: number = 1): this {
        if (this.notEmpty(list)) {
            list.forEach((item, idx) => {
                this.indent(level, false, " " + (idx + 1));
                this.response += ". " + this.valueFormat(item) + "\n";
            });
        }
        return this;
    }

    writeMinimumMaximum(min: number | undefined, max: number | undefined, level: number = 1): this {
        if (this.notEmpty(min) || this.notEmpty(max)) {
            this.writeLine("Range: " + this.valueMinMax(min, max), level);
        }
        return this;
    }

    writeExclusiveMinimumMaximum(min: number | undefined, max: number | undefined, level: number = 1): this {
        if (this.notEmpty(min) || this.notEmpty(max)) {
            this.writeLine("Exclusive Range: " + this.valueMinMaxExclusive(min, max), level);
        }
        return this;
    }

    writeMultipleOf(number: number | undefined, level: number = 1): this {
        if (this.notEmpty(number)) {
            this.writeLine("The value must be a multiple of `" + number + "`", level);
        }
        return this;
    }

    writePattern(pattern: string | undefined, level: number = 1): this {
        if (this.notEmpty(pattern)) {
            this.writeLine("The value must match this pattern: `" + pattern + "`", level);
        }
        return this;
    }

    writeMinMaxLength(min: number | undefined, max: number | undefined, level: number = 1): this {
        if (this.notEmpty(min) || this.notEmpty(max)) {
            this.writeLine("Length: " + this.valueMinMax(min, max), level);
        }
        return this;
    }

    writePropertyNames(data: Schema | undefined, level: number = 1): this {
        if (typeof data?.pattern === "string") {
            this.writeLine("Property names must match this pattern: `" + data.pattern + "`", level);
        }
        return this;
    }

    writePropertyName(prop: string, level: number = 1, path: string, required: boolean = false): this {
        this.indent(level);
        this.response += this.bold(prop, path);
        if (required) {
            this.response += " `required`";
        }
        this.response += "\n";
        return this;
    }

    writeRef(ref: string | undefined, level: number = 1): this {
        if (this.notEmpty(ref) && typeof ref === "string") {
            this.writeLine("&#36;ref: [" + this.escapeLink(ref) + "](" + this.refLink(ref) + ")", level);
        }
        return this;
    }

    writePath(level: number = 1, path: string): this {
        if (this.notEmpty(path)) {
            this.writeLine(this.italic("path: " + path, path.replace("#", "")), level);
        }
        return this;
    }

    writeSchema(uri: string | undefined, level: number = 1): this {
        if (typeof uri === "string" && uri.length > 0) {
            this.writeLine("&#36;schema: [" + uri + "](" + this.refLink(uri) + ")", level);
        }
        return this;
    }

    writeSectionName(name: string, level: number = 1, path?: string): this {
        if (this.notEmpty(name)) {
            this.writeLine(this.boldItalic(name), level);
        }
        return this;
    }

    writeTerm(term: string, level: number = 1): this {
        if (this.notEmpty(term)) {
            this.writeLine(this.boldItalic(term), level);
        }
        return this;
    }

    writeType(type: string | string[] | undefined, level: number = 1, path: string): this {
        if (this.notEmpty(type)) {
            if (Array.isArray(type) && type.length > 1) {
                this.writeLine("Types: `" + type.join("`, `") + "`", level);
            } else {
                this.writeLine("Type: `" + type + "`", level);
            }
        }
        return this;
    }

    writeUniqueItems(bool: boolean | undefined, level: number = 1): this {
        if (this.notEmpty(bool)) {
            if (bool) {
                this.writeLine("Each item must be unique", level);
            }
        }
        return this;
    }

    bold(text: string, id?: string): string {
        if (this.useHtml && id) {
            return this.tag("b", text, id);
        } else {
            return this.emphasize(text, 2);
        }
    }

    italic(text: string, id?: string): string {
        if (this.useHtml && id) {
            return this.tag("i", text, id);
        } else {
            return this.emphasize(text, 1);
        }
    }

    boldItalic(text: string, id?: string): string {
        if (this.useHtml && id) {
            return this.tag("b", this.italic(text), id);
        } else {
            return this.emphasize(text, 3);
        }
    }

    underline(text: string, id?: string): string {
        if (this.useHtml) {
            return this.tag("u", text, id);
        } else {
            return text; // Markdown does not support underline
        }
    }

    tag(tag: string, text: string, id?: string): string {
        id = this.slugify(id || text);
        return `<${tag} id="${id}">${text}</${tag}>`;
    }

    emphasize(text: string, c: number): string {
        const e = this.emphasisChar.repeat(c);
        return e + text + e;
    }

    code(text: string): string {
        return "`" + text + "`";
    }

    valueFormat(value: any): string {
        if (value === "true" || value === "false") {
            return this.italic(value);
        } else if (typeof value === "boolean") {
            return this.italic(this.valueBool(value));
        } else if (typeof value === "string") {
            return this.italic('"' + value + '"');
        } else {
            return this.code(value);
        }
    }

    writeLine(text: string = "", level: number = 1): this {
        this.indent(level);
        this.response += text + "\n";
        if (level < 1) {
            this.response += "\n";
        }
        return this;
    }

    indent(level: number, indentChar: string | false = false, listChar: string = " - "): void {
        if (level > 1) {
            this.response += (indentChar || this.indentChar).repeat(level - 1);
        }
        if (level > 0) {
            this.response += listChar;
        }
    }

    setUseHtml(useHtml: boolean): this {
        this.useHtml = useHtml;
        return this;
    }
}
