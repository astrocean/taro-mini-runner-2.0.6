"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NormalModule = require("webpack/lib/NormalModule");
class TaroNormalModule extends NormalModule {
    constructor(data) {
        super(data);
        this.name = data.name;
        this.miniType = data.miniType;
    }
}
exports.default = TaroNormalModule;
