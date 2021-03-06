"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ModuleDependency = require("webpack/lib/dependencies/ModuleDependency");
class TaroSingleEntryDependency extends ModuleDependency {
    constructor(request, name, loc, miniType) {
        super(request);
        this.name = name;
        this.loc = loc;
        this.miniType = miniType;
    }
    get type() {
        return 'single entry';
    }
}
exports.default = TaroSingleEntryDependency;
