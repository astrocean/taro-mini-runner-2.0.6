"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    name(node) {
        if (node.parent && ['text', 'span'].includes(node.parent.name)) {
            return 'span';
        }
        return node.name;
    }
};
