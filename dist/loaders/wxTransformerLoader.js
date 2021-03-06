"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const qs = require("querystring");
const path = require("path");
const loader_utils_1 = require("loader-utils");
const transformer_wx_1 = require("@tarojs/transformer-wx");
const babel_core_1 = require("babel-core");
const better_babel_generator_1 = require("better-babel-generator");
const constants_1 = require("../utils/constants");
const processAst_1 = require("../utils/processAst");
const utils_1 = require("../utils");
const parseAst_1 = require("../utils/parseAst");
const cannotRemoves = ['@tarojs/taro', 'react', 'nervjs'];
const cachedResults = new Map();
function wxTransformerLoader(source) {
    const { babel: babelConfig, alias, buildAdapter, designWidth, deviceRatio, sourceDir } = loader_utils_1.getOptions(this);
    const filePath = this.resourcePath;
    const { resourceQuery } = this;
    const rawQuery = resourceQuery.slice(1);
    const inheritQuery = `&${rawQuery}`;
    const incomingQuery = qs.parse(rawQuery);
    const isQuickApp = buildAdapter === "quickapp" /* QUICKAPP */;
    try {
        const stringifyRequestFn = r => loader_utils_1.stringifyRequest(this, r);
        const miniType = (incomingQuery.parse ? incomingQuery.parse : this._module.miniType) || constants_1.PARSE_AST_TYPE.NORMAL;
        const rootProps = {};
        if (isQuickApp && miniType === constants_1.PARSE_AST_TYPE.PAGE) {
            // 如果是快应用，需要提前解析一次 ast，获取 config
            const aheadTransformResult = transformer_wx_1.default({
                code: source,
                sourcePath: filePath,
                sourceDir,
                isRoot: miniType === constants_1.PARSE_AST_TYPE.PAGE,
                isTyped: constants_1.REG_TYPESCRIPT.test(filePath),
                adapter: buildAdapter
            });
            const res = parseAst_1.default(aheadTransformResult.ast, buildAdapter);
            const appConfig = this._compiler.appConfig;
            if (res.configObj.enablePullDownRefresh || (appConfig.window && appConfig.window.enablePullDownRefresh)) {
                rootProps.enablePullDownRefresh = true;
            }
            if (appConfig.tabBar) {
                rootProps.tabBar = appConfig.tabBar;
            }
            rootProps.pagePath = filePath.replace(sourceDir, '').replace(path.extname(filePath), '');
            if (res.hasEnablePageScroll) {
                rootProps.enablePageScroll = true;
            }
        }
        const wxTransformerParams = {
            code: source,
            sourceDir: sourceDir,
            sourcePath: filePath,
            isTyped: constants_1.REG_TYPESCRIPT.test(filePath),
            adapter: buildAdapter,
            rootProps: utils_1.isEmptyObject(rootProps) || rootProps
        };
        if (miniType === constants_1.PARSE_AST_TYPE.ENTRY) {
            wxTransformerParams.isApp = true;
        }
        else if (miniType === constants_1.PARSE_AST_TYPE.PAGE) {
            wxTransformerParams.isRoot = true;
        }
        else if (miniType === constants_1.PARSE_AST_TYPE.NORMAL) {
            wxTransformerParams.isNormal = true;
        }
        let template, transCode;
        if (!incomingQuery.parse) {
            const transformResult = transformer_wx_1.default(wxTransformerParams);
            const ast = transformResult.ast;
            template = transformResult.template;
            const newAst = babel_core_1.transformFromAst(ast, '', {
                plugins: [
                    [require('babel-plugin-preval')],
                    [require('babel-plugin-danger-remove-unused-import'), { ignore: cannotRemoves }]
                ]
            }).ast;
            const result = processAst_1.default({
                ast: newAst,
                buildAdapter,
                type: miniType,
                designWidth,
                deviceRatio,
                sourceFilePath: filePath,
                sourceDir,
                alias
            });
            const code = better_babel_generator_1.default(result).code;
            const res = babel_core_1.transform(code, babelConfig);
            if (constants_1.NODE_MODULES_REG.test(filePath) && res.code) {
                res.code = utils_1.npmCodeHack(filePath, res.code, buildAdapter);
            }
            transCode = res.code;
            cachedResults.set(filePath, {
                template,
                transCode
            });
        }
        else {
            const cache = cachedResults.get(filePath);
            template = cache.template;
            transCode = cache.transCode;
        }
        let resultCode = '';
        if (miniType === constants_1.PARSE_AST_TYPE.ENTRY || miniType === constants_1.PARSE_AST_TYPE.PAGE || miniType === constants_1.PARSE_AST_TYPE.COMPONENT) {
            if (incomingQuery.type === 'template') {
                return this.callback(null, template);
            }
            if (incomingQuery.type === 'script') {
                return this.callback(null, transCode);
            }
            if (template && template.length) {
                const query = `?taro&type=template&parse=${miniType}${inheritQuery}`;
                const templateImport = `import { template } from ${stringifyRequestFn(filePath + query)};\n`;
                resultCode += templateImport;
            }
            const scriptQuery = `?taro&type=script&parse=${miniType}${inheritQuery}`;
            const scriptRequest = stringifyRequestFn(filePath + scriptQuery);
            const scriptImport = (`import script from ${scriptRequest}\n` +
                `export * from ${scriptRequest}` // support named exports
            );
            resultCode += scriptImport;
            return resultCode;
        }
        return transCode;
    }
    catch (error) {
        console.log(error);
        this.emitError(error);
        this.callback(null, source);
        return source;
    }
}
exports.default = wxTransformerLoader;
