"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const webpack_sources_1 = require("webpack-sources");
const loader_utils_1 = require("loader-utils");
const constants_1 = require("../utils/constants");
const utils_1 = require("../utils");
const PLUGIN_NAME = 'TaroLoadChunksPlugin';
class TaroLoadChunksPlugin {
    constructor(options) {
        this.commonChunks = options.commonChunks;
        this.buildAdapter = options.buildAdapter;
        this.isBuildPlugin = options.isBuildPlugin;
        this.addChunkPages = options.addChunkPages;
        this.pages = options.pages;
        this.depsMap = options.depsMap;
        this.sourceDir = options.sourceDir;
    }
    apply(compiler) {
        const pagesList = this.pages;
        const addChunkPagesList = new Map();
        const depsMap = this.depsMap;
        compiler.hooks.thisCompilation.tap(PLUGIN_NAME, (compilation) => {
            let commonChunks;
            let fileChunks = new Map();
            compilation.hooks.afterOptimizeChunks.tap(PLUGIN_NAME, (chunks) => {
                commonChunks = chunks.filter(chunk => this.commonChunks.includes(chunk.name)).reverse();
                if (typeof this.addChunkPages === 'function') {
                    this.addChunkPages(addChunkPagesList, Array.from(pagesList).map((item) => item.name));
                    chunks.forEach(chunk => {
                        const id = getIdOrName(chunk);
                        addChunkPagesList.forEach((v, k) => {
                            if (k === id) {
                                const depChunks = v.map(v => ({ name: v }));
                                fileChunks.set(id, depChunks);
                                if (chunk.entryModule) {
                                    let entryModule = chunk.entryModule.rootModule ? chunk.entryModule.rootModule : chunk.entryModule;
                                    if (entryModule) {
                                        const depsComponents = getAllDepComponents(entryModule.resource, depsMap);
                                        depsComponents.forEach(component => {
                                            const id = component.path.replace(this.sourceDir + path.sep, '').replace(path.extname(component.path), '').replace(/\\{1,}/g, '/');
                                            const oriDep = fileChunks.get(id) || [];
                                            fileChunks.set(id, Array.from(new Set([...oriDep, ...depChunks])));
                                        });
                                    }
                                }
                            }
                        });
                    });
                }
            });
            compilation.chunkTemplate.hooks.renderWithEntry.tap(PLUGIN_NAME, (modules, chunk) => {
                if (chunk.entryModule) {
                    if (this.isBuildPlugin) {
                        return addRequireToSource(getIdOrName(chunk), modules, commonChunks);
                    }
                    let entryModule = chunk.entryModule.rootModule ? chunk.entryModule.rootModule : chunk.entryModule;
                    if (entryModule.miniType === constants_1.PARSE_AST_TYPE.ENTRY) {
                        compilation.hooks.afterOptimizeAssets.tap(PLUGIN_NAME, assets => {
                            const files = chunk.files;
                            files.forEach(item => {
                                if (constants_1.REG_STYLE.test(item)) {
                                    const source = new webpack_sources_1.ConcatSource();
                                    const _source = assets[item]._source || assets[item]._value;
                                    Object.keys(assets).forEach(assetName => {
                                        const fileName = path.basename(assetName, path.extname(assetName));
                                        if (constants_1.REG_STYLE.test(assetName) && this.commonChunks.includes(fileName)) {
                                            source.add(`@import ${JSON.stringify(loader_utils_1.urlToRequest(assetName))};`);
                                            source.add('\n');
                                            source.add(_source);
                                            if (assets[item]._source) {
                                                assets[item]._source = source;
                                            }
                                            else {
                                                assets[item]._value = source.source();
                                            }
                                        }
                                    });
                                }
                            });
                        });
                        return addRequireToSource(getIdOrName(chunk), modules, commonChunks);
                    }
                    if ((this.buildAdapter === "quickapp" /* QUICKAPP */) &&
                        (entryModule.miniType === constants_1.PARSE_AST_TYPE.PAGE ||
                            entryModule.miniType === constants_1.PARSE_AST_TYPE.COMPONENT)) {
                        return addRequireToSource(getIdOrName(chunk), modules, commonChunks);
                    }
                    if (fileChunks.size
                        && (entryModule.miniType === constants_1.PARSE_AST_TYPE.PAGE
                            || entryModule.miniType === constants_1.PARSE_AST_TYPE.COMPONENT)) {
                        let source;
                        const id = getIdOrName(chunk);
                        fileChunks.forEach((v, k) => {
                            if (k === id) {
                                source = addRequireToSource(id, modules, v);
                            }
                        });
                        return source;
                    }
                }
            });
        });
    }
}
exports.default = TaroLoadChunksPlugin;
function getIdOrName(chunk) {
    if (typeof chunk.id === 'string') {
        return chunk.id;
    }
    return chunk.name;
}
function getAllDepComponents(filePath, depsMap) {
    let componentsList = new Set();
    depsMap.forEach((value, key) => {
        if (filePath === key) {
            componentsList = new Set([...componentsList, ...value]);
            value.forEach(item => {
                componentsList = new Set([...componentsList, ...getAllDepComponents(item.path, depsMap)]);
            });
        }
    });
    return componentsList;
}
function addRequireToSource(id, modules, commonChunks) {
    const source = new webpack_sources_1.ConcatSource();
    commonChunks.forEach(chunkItem => {
        source.add(`require(${JSON.stringify(utils_1.promoteRelativePath(path.relative(id, chunkItem.name)))});\n`);
    });
    source.add('\n');
    source.add(modules);
    source.add(';');
    return source;
}
