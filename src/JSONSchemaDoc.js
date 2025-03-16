/**
 * @description Generate documentation from JSON Schema.
 * @author Brian Wendt <brianwendt@users.noreply.github.com>
 * @link https://github.com/BrianWendt/json-schema-md-doc
 * @module JSONSchemaDoc
 */
import JSONSchemaMarkdownDoc from "./JSONSchemaMarkdownDoc.js";
class JSONSchemaDoc {
    static markdown(schema, options = {}) {
        return new JSONSchemaMarkdownDoc(schema, options).generate();
    }
}
export default JSONSchemaDoc;
