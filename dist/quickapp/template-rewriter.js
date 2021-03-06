"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parser_1 = require("./template/parser");
const node_1 = require("./template/node");
const serialize_1 = require("./template/serialize");
function rewriterTemplate(code) {
    // 解析Code
    const viewNodes = parser_1.default(`<root>${code}</root>`).children;
    // 解析视图组件
    const retNodes = node_1.default(viewNodes);
    // 生成xml代码
    const templateCode = serialize_1.default(retNodes);
    return templateCode;
}
exports.default = rewriterTemplate;
