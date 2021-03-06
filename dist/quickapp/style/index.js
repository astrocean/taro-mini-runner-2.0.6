"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const css = require("css");
const selector_1 = require("./selector");
const declaration_1 = require("./declaration");
const util_1 = require("./util");
function rewriter(rule, output) {
    output.declaration = {
        deleted: [],
        inserted: []
    };
    const selectors = rule.selectors.map(selector => selector_1.default(selector, rule, output)).filter(v => !!v);
    if (!selectors.length) {
        let commentCssCode = '';
        try {
            commentCssCode = css.stringify({
                stylesheet: {
                    rules: [rule]
                }
            });
        }
        catch (e) {
            output.logs.push({
                reason: 'E:转换失败',
                line: rule.position.start.line,
                column: rule.position.start.column
            });
        }
        return {
            type: 'comment',
            comment: `
${util_1.comment('unsupported selector', 'https://doc.quickapp.cn/widgets/common-styles.html')}
${commentCssCode}
`
        };
    }
    rule.selectors = selectors;
    rule.declarations.forEach(declaration => declaration.type === 'declaration' && declaration_1.default(declaration, rule, output));
    // delete
    output.declaration.deleted.forEach(declaration => util_1.removeDeclaration(declaration, rule));
    // insert declaration
    output.declaration.inserted.forEach(declaration => util_1.addDeclaration(declaration.property, declaration.value, rule));
    // insert comment(by delete)
    output.declaration.deleted.forEach(declaration => util_1.addComment(declaration.property, declaration.value, rule));
    return rule;
}
exports.default = rewriter;
