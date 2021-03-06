"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.comment = (msg, url) => 'Taro comment: ' + msg + '.' + (url ? '[兼容写法参考](' + url + ')' : '');
/**
 * 在rule中删除指定declaration
 */
exports.removeDeclaration = (declaration, rule) => rule.declarations.splice(rule.declarations.findIndex(v => v.property === declaration.property && v.value === declaration.value), 1);
/**
 * 在rule中增加一条declaration
 */
exports.addDeclaration = (property, value, rule) => rule.declarations.push({
    type: 'declaration',
    property,
    value
});
/**
 * 在rule中增加一条comment
 */
exports.addComment = (property, value, rule) => rule.declarations.push({
    type: 'comment',
    comment: `${property}:${value}; ${exports.comment('unsupported style', 'https://doc.quickapp.cn/widgets/common-styles.html')}`
});
exports.getDeclarationValue = (property, rule) => {
    const declarations = rule.declarations.filter(declaration => declaration.property === property);
    return declarations.length && declarations[0] || false;
};
