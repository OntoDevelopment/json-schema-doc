/**
 * @description Converts JSON Schema to Markdown documentation.
 * @author Brian Wendt <brianwendt@users.noreply.github.com>
 * @link https://github.com/OntoDevelopment/json-schema-doc
 * @module JSONSchemaMarkdownDoc
 */
import JSONSchemaDocAbstract from "./JSONSchemaDocAbstract.js";
export default class JSONSchemaMarkdownDoc extends JSONSchemaDocAbstract {
    constructor() {
        super(...arguments);
        this.indentChar = "\t";
        this.pathDivider = "/";
        this.objectNotation = "&thinsp;.&thinsp;";
        this.footer = "\n_Generated with [json-schema-md-doc](https://brianwendt.github.io/json-schema-md-doc/)_";
        this.useHtml = true;
        this.emphasisChar = "*";
    }
    generateResponse() {
        if (this.errors.length > 0) {
            return this.errors.join("\n");
        } else {
            this.response += this.footer;
            return this.response;
        }
    }
    writeAdditionalItems(bool, level = 1) {
        if (this.empty(bool)) {
            return this;
        }
        if (bool) {
            return this.writeLine("This schema " + this.underline("does not") + " accept additional items.", level);
        } else {
            return this.writeLine("This schema accepts additional items.", level);
        }
    }
    writeItemsMinMax(min, max, level = 1) {
        if (this.notEmpty(min) || this.notEmpty(max)) {
            this.writeLine("Item Count: " + this.valueMinMax(min, max), level);
        }
        return this;
    }
    writeAdditionalProperties(bool, level = 1) {
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
    writeMinMaxProperties(min, max, level = 1) {
        if (this.notEmpty(min) || this.notEmpty(max)) {
            this.writeLine("Property Count: " + this.valueMinMax(min, max), level);
        }
        return this;
    }
    writeComment(comment, level = 1, path) {
        if (this.empty(comment) || typeof comment !== "string") {
            return this;
        }
        const nl = this.useHtml ? "<br/>" : "\n";
        return this.writeLine(this.bold("Comment", path) + nl + this.italic(comment), level);
    }
    writeConst(constant, level = 1) {
        if (this.notEmpty(constant)) {
            this.writeLine("Constant value: " + this.valueFormat(constant), level);
        }
        return this;
    }
    writeConditionalIf(schema, level = 1) {
        if (this.notEmpty(schema)) {
            this.writeLine("If: ", level);
            this.generateChildren("if", schema, level + 1, "");
        }
        return this;
    }
    writeConditionalThen(schema, level = 1) {
        if (this.notEmpty(schema)) {
            this.writeLine("Then: ", level);
            this.generateChildren("then", schema, level + 1, "");
        }
        return this;
    }
    writeConditionalElse(schema, level = 1) {
        if (this.notEmpty(schema)) {
            this.writeLine("Else: ", level);
            this.generateChildren("else", schema, level + 1, "");
        }
        return this;
    }
    writeContentEncoding(contentEncoding, level = 1) {
        if (this.notEmpty(contentEncoding)) {
            this.writeLine("Content Encoding: " + contentEncoding, level);
        }
        return this;
    }
    writeContentMediaType(contentMediaType, level = 1) {
        if (this.notEmpty(contentMediaType)) {
            this.writeLine("Content Media Type: " + contentMediaType, level);
        }
        return this;
    }
    writeContains(contains, level = 1) {
        if (this.notEmpty(contains)) {
            this.writeLine("Contains: ", level);
            this.generateChildren("contains", contains, level + 1, "");
        }
        return this;
    }
    writeDefault(value, level = 1, path) {
        if (this.notEmpty(value)) {
            this.writeLine("Default: " + this.valueFormat(value), level);
        }
        return this;
    }
    writeDescription(description, level = 1, path) {
        if (this.notEmpty(description) && typeof description === "string") {
            this.writeLine("_" + description.replace("\n", "<br>") + "_", level);
        }
        return this;
    }
    writeDependencies(dependencies, level = 1) {
        if (this.notEmpty(dependencies)) {
            this.writeLine("Dependencies: ", level);
            this.writeList(Object.keys(dependencies), level + 1);
        }
        return this;
    }
    writeEnum(list, level = 1) {
        if (this.notEmpty(list) && typeof list === "object") {
            this.writeLine("The value is restricted to the following: ", level);
            this.writeList(list, level + 1);
        }
        return this;
    }
    writeFormat(format, level = 1) {
        if (this.notEmpty(format)) {
            this.writeLine('String format must be a "' + format + '"', level);
        }
        return this;
    }
    writeExamples(list, level = 1, path) {
        if (this.notEmpty(list) && typeof list === "object") {
            this.writeLine("Example values: ", level);
            this.writeList(list, level + 1);
        }
        return this;
    }
    writeHeader(header, level = 1, path) {
        if (this.notEmpty(header)) {
            this.writeLine("#".repeat(Math.min(level + 1, 5)) + " " + header, level);
        }
        return this;
    }
    writeId(id, level = 1, path) {
        if (this.notEmpty(id) && typeof id === "string") {
            this.writeLine(this.bold("&#36;id: " + id, id), level);
        }
        return this;
    }
    writeList(list, level = 1) {
        if (this.notEmpty(list)) {
            list.forEach((item, idx) => {
                this.indent(level, false, " " + (idx + 1));
                this.response += ". " + this.valueFormat(item) + "\n";
            });
        }
        return this;
    }
    writeMinimumMaximum(min, max, level = 1) {
        if (this.notEmpty(min) || this.notEmpty(max)) {
            this.writeLine("Range: " + this.valueMinMax(min, max), level);
        }
        return this;
    }
    writeExclusiveMinimumMaximum(min, max, level = 1) {
        if (this.notEmpty(min) || this.notEmpty(max)) {
            this.writeLine("Exclusive Range: " + this.valueMinMaxExclusive(min, max), level);
        }
        return this;
    }
    writeMultipleOf(number, level = 1) {
        if (this.notEmpty(number)) {
            this.writeLine("The value must be a multiple of `" + number + "`", level);
        }
        return this;
    }
    writePattern(pattern, level = 1) {
        if (this.notEmpty(pattern)) {
            this.writeLine("The value must match this pattern: `" + pattern + "`", level);
        }
        return this;
    }
    writeMinMaxLength(min, max, level = 1) {
        if (this.notEmpty(min) || this.notEmpty(max)) {
            this.writeLine("Length: " + this.valueMinMax(min, max), level);
        }
        return this;
    }
    writePropertyNames(data, level = 1) {
        if (typeof (data === null || data === void 0 ? void 0 : data.pattern) === "string") {
            this.writeLine("Property names must match this pattern: `" + data.pattern + "`", level);
        }
        return this;
    }
    writePropertyName(prop, level = 1, path, required = false) {
        this.indent(level);
        this.response += this.bold(prop, path);
        if (required) {
            this.response += " `required`";
        }
        this.response += "\n";
        return this;
    }
    writeRef(ref, level = 1) {
        if (this.notEmpty(ref) && typeof ref === "string") {
            this.writeLine("&#36;ref: [" + this.escapeLink(ref) + "](" + this.refLink(ref) + ")", level);
        }
        return this;
    }
    writePath(level = 1, path) {
        if (this.notEmpty(path)) {
            this.writeLine(this.italic("path: " + path, path.replace("#", "")), level);
        }
        return this;
    }
    writeSchema(uri, level = 1) {
        if (typeof uri === "string" && uri.length > 0) {
            this.writeLine("&#36;schema: [" + uri + "](" + this.refLink(uri) + ")", level);
        }
        return this;
    }
    writeSectionName(name, level = 1, path) {
        if (this.notEmpty(name)) {
            this.writeLine(this.boldItalic(name), level);
        }
        return this;
    }
    writeTerm(term, level = 1) {
        if (this.notEmpty(term)) {
            this.writeLine(this.boldItalic(term), level);
        }
        return this;
    }
    writeType(type, level = 1, path) {
        if (this.notEmpty(type)) {
            if (Array.isArray(type) && type.length > 1) {
                this.writeLine("Types: `" + type.join("`, `") + "`", level);
            } else {
                this.writeLine("Type: `" + type + "`", level);
            }
        }
        return this;
    }
    writeUniqueItems(bool, level = 1) {
        if (this.notEmpty(bool)) {
            if (bool) {
                this.writeLine("Each item must be unique", level);
            }
        }
        return this;
    }
    bold(text, id) {
        if (this.useHtml && id) {
            return this.tag("b", text, id);
        } else {
            return this.emphasize(text, 2);
        }
    }
    italic(text, id) {
        if (this.useHtml && id) {
            return this.tag("i", text, id);
        } else {
            return this.emphasize(text, 1);
        }
    }
    boldItalic(text, id) {
        if (this.useHtml && id) {
            return this.tag("b", this.italic(text), id);
        } else {
            return this.emphasize(text, 3);
        }
    }
    underline(text, id) {
        if (this.useHtml) {
            return this.tag("u", text, id);
        } else {
            return text; // Markdown does not support underline
        }
    }
    tag(tag, text, id) {
        id = this.slugify(id || text);
        return `<${tag} id="${id}">${text}</${tag}>`;
    }
    emphasize(text, c) {
        const e = this.emphasisChar.repeat(c);
        return e + text + e;
    }
    code(text) {
        return "`" + text + "`";
    }
    valueFormat(value) {
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
    writeLine(text = "", level = 1) {
        this.indent(level);
        this.response += text + "\n";
        if (level < 1) {
            this.response += "\n";
        }
        return this;
    }
    indent(level, indentChar = false, listChar = " - ") {
        if (level > 1) {
            this.response += (indentChar || this.indentChar).repeat(level - 1);
        }
        if (level > 0) {
            this.response += listChar;
        }
    }
    setUseHtml(useHtml) {
        this.useHtml = useHtml;
        return this;
    }
}
