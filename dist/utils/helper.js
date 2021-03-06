"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const _1 = require(".");
const constants_1 = require("./constants");
function getTaroJsQuickAppComponentsPath(nodeModulesPath) {
    const taroJsQuickAppComponentsPkg = _1.getInstalledNpmPkgPath(constants_1.taroJsQuickAppComponents, nodeModulesPath);
    if (!taroJsQuickAppComponentsPkg) {
        _1.printLog("error" /* ERROR */, '包安装', `缺少包 ${constants_1.taroJsQuickAppComponents}，请安装！`);
        process.exit(0);
    }
    return path.join(path.dirname(taroJsQuickAppComponentsPkg), 'src/components');
}
exports.getTaroJsQuickAppComponentsPath = getTaroJsQuickAppComponentsPath;
function getImportTaroSelfComponents(filePath, nodeModulesPath, outputDir, taroSelfComponents) {
    const importTaroSelfComponents = new Set();
    const taroJsQuickAppComponentsPath = getTaroJsQuickAppComponentsPath(nodeModulesPath);
    taroSelfComponents.forEach(c => {
        const cPath = path.join(taroJsQuickAppComponentsPath, c);
        const cMainPath = path.join(cPath, 'index');
        const cRelativePath = _1.promoteRelativePath(path.relative(filePath, cMainPath.replace(nodeModulesPath, path.join(outputDir, 'npm'))));
        importTaroSelfComponents.add({
            path: cRelativePath,
            name: c
        });
    });
    return importTaroSelfComponents;
}
exports.getImportTaroSelfComponents = getImportTaroSelfComponents;
function getImportCustomComponents(sourceFilePath, depComponents) {
    const importCustomComponents = new Set();
    depComponents.forEach(item => {
        const extnamePath = item.path.replace(path.extname(item.path), '');
        const cRelativePath = _1.promoteRelativePath(path.relative(sourceFilePath, extnamePath)).replace(/\\/g, '/');
        importCustomComponents.add({
            path: cRelativePath,
            name: item.name
        });
    });
    return importCustomComponents;
}
exports.getImportCustomComponents = getImportCustomComponents;
function generateQuickAppUx({ script, template, style, imports }) {
    let uxTxt = '';
    if (imports && imports.size) {
        imports.forEach(item => {
            uxTxt += `<import src='${item.path}' name='${item.name}'></import>\n`;
        });
    }
    if (style) {
        if (constants_1.REG_STYLE.test(style)) {
            uxTxt += `<style src="${style}"></style>\n`;
        }
        else {
            uxTxt += `<style>\n${style}\n</style>\n`;
        }
    }
    if (template) {
        uxTxt += `<template>\n${template}\n</template>\n`;
    }
    if (script) {
        if (constants_1.REG_SCRIPT.test(script)) {
            uxTxt += `<script src="${script}"></script>\n`;
        }
        else {
            uxTxt += `<script>\n${script}\n</script>\n`;
        }
    }
    return uxTxt;
}
exports.generateQuickAppUx = generateQuickAppUx;
function generateQuickAppManifest({ appConfig, quickappJSON, pageConfigs, designWidth }) {
    // 生成 router
    const pages = appConfig.pages.concat();
    const routerPages = {};
    const customPageConfig = quickappJSON.customPageConfig || {};
    pages.forEach(element => {
        const customConfig = customPageConfig[element];
        const pageConf = {
            component: path.basename(element)
        };
        if (customConfig) {
            const filter = customConfig.filter;
            const launchMode = customConfig.launchMode;
            if (filter) {
                pageConf.filter = filter;
            }
            if (launchMode) {
                pageConf.launchMode = launchMode;
            }
        }
        routerPages[_1.removeHeadSlash(path.dirname(element))] = pageConf;
    });
    delete quickappJSON.customPageConfig;
    const routerEntry = pages.shift();
    const router = {
        entry: _1.removeHeadSlash(path.dirname(routerEntry)),
        pages: routerPages
    };
    // 生成 display
    const display = JSON.parse(JSON.stringify(appConfig.window || {}));
    display.pages = {};
    pageConfigs.forEach((item, page) => {
        if (item) {
            display.pages[_1.removeHeadSlash(path.dirname(page))] = item;
        }
    });
    quickappJSON.router = router;
    quickappJSON.display = display;
    quickappJSON.config = Object.assign({}, quickappJSON.config, {
        designWidth: designWidth || 750
    });
    if (appConfig.window && appConfig.window.navigationStyle === 'custom') {
        quickappJSON.display.titleBar = false;
        delete quickappJSON.display.navigationStyle;
    }
    return quickappJSON;
}
exports.generateQuickAppManifest = generateQuickAppManifest;
