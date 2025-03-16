/**
 * @description Generate documentation from JSON Schema.
 * @author Brian Wendt <brianwendt@users.noreply.github.com>
 * @link https://github.com/BrianWendt/json-schema-md-doc
 * @module JSONSchemaDoc
 */

import JSONSchemaMarkdownDoc from "./JSONSchemaMarkdownDoc";

class JSONSchemaDoc {
    static markdown(schema: Schema | string, options: object = {}): string {
        return (new JSONSchemaMarkdownDoc(schema, options)).generate();
    }
}

export default JSONSchemaDoc;