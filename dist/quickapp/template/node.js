"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tag_1 = require("./tag");
const utils_1 = require("./utils");
const walk = (node) => {
    // 获取quickapp需处理的组件名称
    const tags = tag_1.default('.', {});
    const component = tags[node.name];
    if (component) {
        // 组件不支持子组件，则将子组件注释
        if (component.subcomponent && (node.children && node.children.length)) {
            node.$delete = true;
            node.url = component.url || 'https://doc.quickapp.cn/widgets/common-events.html';
            return;
        }
        if (utils_1.uniqTypeof(component.name) === 'function') {
            node.name = component.name(node);
            const children = node.children;
            children && children.forEach(childNode => {
                if (childNode.parent && childNode.parent.name) {
                    childNode.parent.name = node.name;
                }
            });
        }
        else {
            node.name = component.name;
        }
    }
    const children = node.children;
    if (children.length) {
        children.forEach(childNode => {
            walk(childNode);
        });
    }
};
function rewriteNode(nodes) {
    const retNodes = [];
    nodes.forEach(node => {
        retNodes.push(node);
    });
    retNodes.forEach(node => walk(node));
    return retNodes;
}
exports.default = rewriteNode;
