"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra");
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const csso_webpack_plugin_1 = require("csso-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const sass = require("node-sass");
const lodash_1 = require("lodash");
const fp_1 = require("lodash/fp");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const webpack = require("webpack");
const chalk_1 = require("chalk");
const postcss_conf_1 = require("./postcss.conf");
const MiniPlugin_1 = require("../plugins/MiniPlugin");
const utils_1 = require("../utils");
const constants_1 = require("../utils/constants");
const globalObjectMap = {
    ["weapp" /* WEAPP */]: 'wx',
    ["alipay" /* ALIPAY */]: 'my',
    ["swan" /* SWAN */]: 'swan',
    ["qq" /* QQ */]: 'qq',
    ["tt" /* TT */]: 'tt',
    ["jd" /* JD */]: 'jd',
    ["quickapp" /* QUICKAPP */]: 'global'
};
const defaultUglifyJsOption = {
    keep_fnames: true,
    output: {
        comments: false,
        keep_quoted_props: true,
        quote_keys: true,
        beautify: false
    },
    warnings: false
};
const defaultCSSCompressOption = {
    mergeRules: false,
    mergeIdents: false,
    reduceIdents: false,
    discardUnused: false,
    minifySelectors: false
};
const defaultMediaUrlLoaderOption = {
    limit: 10240
};
const defaultFontUrlLoaderOption = {
    limit: 10240
};
const defaultImageUrlLoaderOption = {
    limit: 10240
};
const defaultCssModuleOption = {
    enable: false,
    config: {
        namingPattern: 'global',
        generateScopedName: '[name]__[local]___[hash:base64:5]'
    }
};
const getLoader = (loaderName, options) => {
    return {
        loader: require.resolve(loaderName),
        options: options || {}
    };
};
const listify = listOrItem => {
    if (Array.isArray(listOrItem)) {
        return listOrItem;
    }
    return [listOrItem];
};
const getPlugin = (plugin, args) => {
    return {
        plugin,
        args
    };
};
exports.mergeOption = ([...options]) => {
    return utils_1.recursiveMerge({}, ...options);
};
const styleModuleReg = /(.*\.module).*\.(css|s[ac]ss|less|styl)\b/;
const styleGlobalReg = /(.*\.global).*\.(css|s[ac]ss|less|styl)\b/;
exports.processEnvOption = lodash_1.partial(fp_1.mapKeys, (key) => `process.env.${key}`);
exports.getCssLoader = fp_1.pipe(exports.mergeOption, lodash_1.partial(getLoader, 'css-loader'));
exports.getPostcssLoader = fp_1.pipe(exports.mergeOption, lodash_1.partial(getLoader, 'postcss-loader'));
exports.getSassLoader = fp_1.pipe(exports.mergeOption, lodash_1.partial(getLoader, 'sass-loader'));
exports.getLessLoader = fp_1.pipe(exports.mergeOption, lodash_1.partial(getLoader, 'less-loader'));
exports.getStylusLoader = fp_1.pipe(exports.mergeOption, lodash_1.partial(getLoader, 'stylus-loader'));
exports.getUrlLoader = fp_1.pipe(exports.mergeOption, lodash_1.partial(getLoader, 'url-loader'));
exports.getFileLoader = fp_1.pipe(exports.mergeOption, lodash_1.partial(getLoader, 'file-loader'));
exports.getWxTransformerLoader = fp_1.pipe(exports.mergeOption, lodash_1.partial(getLoader, path.resolve(__dirname, '../loaders/wxTransformerLoader')));
exports.getMiniTemplateLoader = fp_1.pipe(exports.mergeOption, lodash_1.partial(getLoader, path.resolve(__dirname, '../loaders/miniTemplateLoader')));
const getExtractCssLoader = () => {
    return {
        loader: MiniCssExtractPlugin.loader
    };
};
const getQuickappStyleLoader = () => {
    return {
        loader: require.resolve(path.resolve(__dirname, '../loaders/quickappStyleLoader'))
    };
};
exports.getMiniCssExtractPlugin = fp_1.pipe(exports.mergeOption, listify, lodash_1.partial(getPlugin, MiniCssExtractPlugin));
exports.getDefinePlugin = fp_1.pipe(exports.mergeOption, listify, lodash_1.partial(getPlugin, webpack.DefinePlugin));
exports.getUglifyPlugin = ([enableSourceMap, uglifyOptions]) => {
    return new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: enableSourceMap,
        uglifyOptions: utils_1.recursiveMerge({}, defaultUglifyJsOption, uglifyOptions)
    });
};
exports.getCssoWebpackPlugin = ([cssoOption]) => {
    return fp_1.pipe(listify, lodash_1.partial(getPlugin, csso_webpack_plugin_1.default))([exports.mergeOption([defaultCSSCompressOption, cssoOption]), constants_1.REG_STYLE]);
};
exports.getCopyWebpackPlugin = ({ copy, appPath }) => {
    const args = [
        copy.patterns.map(({ from, to }) => {
            return {
                from,
                to: path.resolve(appPath, to),
                context: appPath
            };
        }),
        copy.options
    ];
    return lodash_1.partial(getPlugin, CopyWebpackPlugin)(args);
};
exports.getMiniPlugin = args => {
    MiniPlugin_1.default.init();
    return lodash_1.partial(getPlugin, MiniPlugin_1.default)([args]);
};
exports.getModule = (appPath, { sourceDir, designWidth, deviceRatio, buildAdapter, constantsReplaceList, enableSourceMap, cssLoaderOption, lessLoaderOption, sassLoaderOption, stylusLoaderOption, fontUrlLoaderOption, imageUrlLoaderOption, mediaUrlLoaderOption, postcss, compile, babel, alias }) => {
    const isQuickapp = buildAdapter === "quickapp" /* QUICKAPP */;
    const postcssOption = postcss || {};
    const cssModuleOptions = utils_1.recursiveMerge({}, defaultCssModuleOption, postcssOption.cssModules);
    const { namingPattern, generateScopedName } = cssModuleOptions.config;
    const cssOptions = [
        {
            importLoaders: 1,
            sourceMap: enableSourceMap,
            modules: false
        },
        cssLoaderOption
    ];
    const cssOptionsWithModule = [
        Object.assign({
            importLoaders: 1,
            sourceMap: enableSourceMap,
            modules: {
                mode: namingPattern === 'module' ? 'local' : 'global'
            }
        }, {
            modules: typeof generateScopedName === 'function'
                ? { getLocalIdent: (context, _, localName) => generateScopedName(localName, context.resourcePath) }
                : { localIdentName: generateScopedName }
        }),
        cssLoaderOption
    ];
    const extractCssLoader = getExtractCssLoader();
    const quickappStyleLoader = getQuickappStyleLoader();
    const cssLoader = exports.getCssLoader(cssOptions);
    const cssLoaders = [{
            use: isQuickapp ? [cssLoader, quickappStyleLoader] : [cssLoader]
        }];
    const compileExclude = compile.exclude || [];
    const compileInclude = compile.include || [];
    if (cssModuleOptions.enable) {
        const cssLoaderWithModule = exports.getCssLoader(cssOptionsWithModule);
        let cssModuleCondition;
        if (cssModuleOptions.config.namingPattern === 'module') {
            /* 不排除 node_modules 内的样式 */
            cssModuleCondition = styleModuleReg;
        }
        else {
            cssModuleCondition = {
                and: [
                    { exclude: styleGlobalReg },
                    { exclude: [utils_1.isNodeModule] }
                ]
            };
        }
        cssLoaders.unshift({
            include: [cssModuleCondition],
            use: [cssLoaderWithModule]
        });
    }
    const postcssLoader = exports.getPostcssLoader([
        { sourceMap: enableSourceMap },
        {
            ident: 'postcss',
            plugins: postcss_conf_1.getPostcssPlugins(appPath, {
                isQuickapp,
                designWidth,
                deviceRatio,
                postcssOption
            })
        }
    ]);
    const sassLoader = exports.getSassLoader([{
            sourceMap: true,
            implementation: sass
        }, sassLoaderOption]);
    const lessLoader = exports.getLessLoader([{ sourceMap: enableSourceMap }, lessLoaderOption]);
    const stylusLoader = exports.getStylusLoader([{ sourceMap: enableSourceMap }, stylusLoaderOption]);
    const wxTransformerLoader = exports.getWxTransformerLoader([{
            babel,
            alias,
            designWidth,
            deviceRatio,
            buildAdapter,
            constantsReplaceList,
            sourceDir
        }]);
    const miniTemplateLoader = exports.getMiniTemplateLoader([{
            buildAdapter
        }]);
    let scriptsLoaderConf = {
        test: constants_1.REG_SCRIPTS,
        use: [wxTransformerLoader],
    };
    if (compileExclude && compileExclude.length) {
        scriptsLoaderConf = Object.assign({}, scriptsLoaderConf, {
            exclude: compileExclude
        });
    }
    if (compileInclude && compileInclude.length) {
        scriptsLoaderConf = Object.assign({}, scriptsLoaderConf, {
            include: compileInclude
        });
    }
    const rule = {
        sass: {
            test: constants_1.REG_SASS,
            enforce: 'pre',
            use: [sassLoader]
        },
        less: {
            test: constants_1.REG_LESS,
            enforce: 'pre',
            use: [lessLoader]
        },
        stylus: {
            test: constants_1.REG_STYLUS,
            enforce: 'pre',
            use: [stylusLoader]
        },
        css: {
            test: constants_1.REG_STYLE,
            oneOf: cssLoaders
        },
        // styleFiles: {
        //   test: REG_STYLE,
        //   use: [fileLoader]
        // },
        postcss: {
            test: constants_1.REG_STYLE,
            use: [postcssLoader]
        },
        customStyle: {
            test: constants_1.REG_STYLE,
            enforce: 'post',
            use: [extractCssLoader]
        },
        script: scriptsLoaderConf,
        template: {
            test: constants_1.REG_TEMPLATE,
            use: [exports.getFileLoader([{
                        useRelativePath: true,
                        name: `[path][name]${constants_1.MINI_APP_FILES[buildAdapter].TEMPL}`,
                        context: sourceDir
                    }]), miniTemplateLoader]
        },
        media: {
            test: constants_1.REG_MEDIA,
            use: {
                urlLoader: exports.getUrlLoader([defaultMediaUrlLoaderOption, Object.assign(Object.assign({ name: `[path][name].[ext]`, useRelativePath: true, context: sourceDir }, mediaUrlLoaderOption), { limit: isQuickapp ? false : mediaUrlLoaderOption.limit })])
            }
        },
        font: {
            test: constants_1.REG_FONT,
            use: {
                urlLoader: exports.getUrlLoader([defaultFontUrlLoaderOption, Object.assign(Object.assign({ name: `[path][name].[ext]`, useRelativePath: true, context: sourceDir }, fontUrlLoaderOption), { limit: isQuickapp ? false : fontUrlLoaderOption.limit })])
            }
        },
        image: {
            test: constants_1.REG_IMAGE,
            use: {
                urlLoader: exports.getUrlLoader([defaultImageUrlLoaderOption, Object.assign(Object.assign({ name: `[path][name].[ext]`, useRelativePath: true, context: sourceDir }, imageUrlLoaderOption), { limit: isQuickapp ? false : imageUrlLoaderOption.limit })])
            }
        }
    };
    return { rule };
};
exports.getEntry = ({ sourceDir, entry, isBuildPlugin }) => {
    if (!isBuildPlugin) {
        return {
            entry
        };
    }
    const pluginDir = path.join(sourceDir, 'plugin');
    if (!fs.existsSync(pluginDir)) {
        console.log(chalk_1.default.red('插件目录不存在，请检查！'));
        return;
    }
    const pluginConfigPath = path.join(pluginDir, 'plugin.json');
    if (!fs.existsSync(pluginConfigPath)) {
        console.log(chalk_1.default.red('缺少插件配置文件，请检查！'));
        return;
    }
    const pluginConfig = fs.readJSONSync(pluginConfigPath);
    const entryObj = {};
    Object.keys(pluginConfig).forEach(key => {
        if (key === 'main') {
            const filePath = path.join(pluginDir, pluginConfig[key]);
            const fileName = path.basename(filePath).replace(path.extname(filePath), '');
            entryObj[`plugin/${fileName}`] = [utils_1.resolveScriptPath(filePath.replace(path.extname(filePath), ''))];
        }
        else if (key === 'publicComponents' || key === 'pages') {
            Object.keys(pluginConfig[key]).forEach(subKey => {
                const filePath = path.join(pluginDir, pluginConfig[key][subKey]);
                entryObj[`plugin/${pluginConfig[key][subKey]}`] = [utils_1.resolveScriptPath(filePath.replace(path.extname(filePath), ''))];
            });
        }
    });
    return {
        entry: entryObj,
        pluginConfig
    };
};
function getOutput(appPath, [{ outputRoot, publicPath, buildAdapter, isBuildPlugin }, customOutput]) {
    return Object.assign({ path: path.join(appPath, outputRoot), publicPath, filename: '[name].js', chunkFilename: '[name].js', globalObject: globalObjectMap[buildAdapter] }, customOutput);
}
exports.getOutput = getOutput;
function getDevtool(enableSourceMap) {
    return enableSourceMap ? 'cheap-module-eval-source-map' : 'none';
}
exports.getDevtool = getDevtool;
