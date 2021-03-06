"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const webpack = require("webpack");
const runner_utils_1 = require("@tarojs/runner-utils");
const constants_1 = require("./utils/constants");
const logHelper_1 = require("./utils/logHelper");
const build_conf_1 = require("./webpack/build.conf");
const customizeChain = (chain, customizeFunc) => {
    if (customizeFunc instanceof Function) {
        customizeFunc(chain, webpack, constants_1.PARSE_AST_TYPE);
    }
};
const makeConfig = (buildConfig) => __awaiter(void 0, void 0, void 0, function* () {
    const sassLoaderOption = yield runner_utils_1.getSassLoaderOption(buildConfig);
    return Object.assign(Object.assign({}, buildConfig), { sassLoaderOption });
});
function build(appPath, config, mainBuilder) {
    const mode = config.mode;
    return new Promise((resolve, reject) => {
        const { buildAdapter } = config;
        if (buildAdapter === "plugin" /* PLUGIN */) {
            config.buildAdapter = "weapp" /* WEAPP */;
            config.isBuildPlugin = true;
        }
        makeConfig(config)
            .then(config => {
            const webpackChain = build_conf_1.default(appPath, mode, config);
            customizeChain(webpackChain, config.webpackChain);
            const webpackConfig = webpackChain.toConfig();
            const compiler = webpack(webpackConfig);
            if (config.isWatch) {
                logHelper_1.bindDevLogger(compiler, config.buildAdapter);
                compiler.watch({
                    aggregateTimeout: 300,
                    poll: true
                }, (err, stats) => {
                    if (err) {
                        logHelper_1.printBuildError(err);
                        return reject(err);
                    }
                    mainBuilder.hooks.afterBuild.call(stats);
                    resolve();
                });
            }
            else {
                logHelper_1.bindProdLogger(compiler, config.buildAdapter);
                compiler.run((err, stats) => {
                    if (err) {
                        logHelper_1.printBuildError(err);
                        return reject(err);
                    }
                    mainBuilder.hooks.afterBuild.call(stats);
                    resolve();
                });
            }
        });
    });
}
exports.default = build;
