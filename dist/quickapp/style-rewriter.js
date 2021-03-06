"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const css = require("css");
const style_1 = require("./style");
function rewriter(code, isProduction) {
    const logs = [];
    const ast = css.parse(code, {
        silent: true
    });
    // catch syntax error
    if (ast.stylesheet.parsingErrors && ast.stylesheet.parsingErrors.length) {
        ast.stylesheet.parsingErrors.forEach(function (error) {
            logs.push({
                line: error.line,
                column: error.column,
                reason: error.toString()
            });
        });
    }
    // 针对快应用样式进行转换
    if (ast && ast.type === 'stylesheet' && ast.stylesheet &&
        ast.stylesheet.rules && ast.stylesheet.rules.length) {
        const rules = [];
        ast.stylesheet.rules.forEach(function (rule, index) {
            const type = rule.type;
            if (type === 'rule') {
                const newRule = style_1.default(rule, {
                    logs: logs
                });
                if (newRule) {
                    rules.push(newRule);
                }
            }
            else {
                rules.push(rule);
            }
        });
        ast.stylesheet.rules = rules;
    }
    if (!ast) {
        return '';
    }
    // 输出转换结果
    try {
        const resContent = css.stringify(ast, {
            compress: !!isProduction
        });
        return resContent;
    }
    catch (e) {
        return '';
    }
}
exports.default = rewriter;
