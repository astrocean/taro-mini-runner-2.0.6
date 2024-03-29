"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const os = require("os");
const chalk_1 = require("chalk");
exports.CSS_EXT = ['.css', '.scss', '.sass', '.less', '.styl', '.wxss', '.acss'];
exports.SCSS_EXT = ['.scss'];
exports.JS_EXT = ['.js', '.jsx'];
exports.TS_EXT = ['.ts', '.tsx'];
exports.UX_EXT = ['.ux'];
exports.REG_JS = /\.js(\?.*)?$/;
exports.REG_SCRIPT = /\.(js|jsx)(\?.*)?$/;
exports.REG_TYPESCRIPT = /\.(tsx|ts)(\?.*)?$/;
exports.REG_SCRIPTS = /\.[tj]sx?$/i;
exports.REG_SASS = /\.(s[ac]ss)$/;
exports.REG_LESS = /\.less$/;
exports.REG_STYLUS = /\.styl$/;
exports.REG_STYLE = /\.(css|scss|sass|less|styl|wxss|acss)(\?.*)?$/;
exports.REG_MEDIA = /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/;
exports.REG_IMAGE = /\.(png|jpe?g|gif|bpm|svg|webp)(\?.*)?$/;
exports.REG_FONT = /\.(woff2?|eot|ttf|otf)(\?.*)?$/;
exports.REG_JSON = /\.json(\?.*)?$/;
exports.REG_UX = /\.ux(\?.*)?$/;
exports.REG_TEMPLATE = /\.(wxml|axml|ttml|qml|swan|jxml)(\?.*)?$/;
exports.REG_WXML_IMPORT = /<import(.*)?src=(?:(?:'([^']*)')|(?:"([^"]*)"))/gi;
exports.REG_URL = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
exports.CSS_IMPORT_REG = /@import (["'])(.+?)\1;/g;
exports.NODE_MODULES = 'node_modules';
exports.NODE_MODULES_REG = /(.*)node_modules/;
var BUILD_TYPES;
(function (BUILD_TYPES) {
    BUILD_TYPES["WEAPP"] = "weapp";
    BUILD_TYPES["SWAN"] = "swan";
    BUILD_TYPES["ALIPAY"] = "alipay";
    BUILD_TYPES["TT"] = "tt";
    BUILD_TYPES["UI"] = "ui";
    BUILD_TYPES["PLUGIN"] = "plugin";
    BUILD_TYPES["QUICKAPP"] = "quickapp";
    BUILD_TYPES["QQ"] = "qq";
    BUILD_TYPES["JD"] = "jd";
})(BUILD_TYPES = exports.BUILD_TYPES || (exports.BUILD_TYPES = {}));
var TEMPLATE_TYPES;
(function (TEMPLATE_TYPES) {
    TEMPLATE_TYPES["WEAPP"] = ".wxml";
    TEMPLATE_TYPES["SWAN"] = ".swan";
    TEMPLATE_TYPES["ALIPAY"] = ".axml";
    TEMPLATE_TYPES["TT"] = ".ttml";
    TEMPLATE_TYPES["QUICKAPP"] = ".ux";
    TEMPLATE_TYPES["QQ"] = ".qml";
    TEMPLATE_TYPES["JD"] = ".jxml";
})(TEMPLATE_TYPES = exports.TEMPLATE_TYPES || (exports.TEMPLATE_TYPES = {}));
var STYLE_TYPES;
(function (STYLE_TYPES) {
    STYLE_TYPES["WEAPP"] = ".wxss";
    STYLE_TYPES["SWAN"] = ".css";
    STYLE_TYPES["ALIPAY"] = ".acss";
    STYLE_TYPES["TT"] = ".ttss";
    STYLE_TYPES["QUICKAPP"] = ".css";
    STYLE_TYPES["QQ"] = ".qss";
    STYLE_TYPES["JD"] = ".jxss";
})(STYLE_TYPES = exports.STYLE_TYPES || (exports.STYLE_TYPES = {}));
var SCRIPT_TYPES;
(function (SCRIPT_TYPES) {
    SCRIPT_TYPES["WEAPP"] = ".js";
    SCRIPT_TYPES["SWAN"] = ".js";
    SCRIPT_TYPES["ALIPAY"] = ".js";
    SCRIPT_TYPES["TT"] = ".js";
    SCRIPT_TYPES["QUICKAPP"] = ".js";
    SCRIPT_TYPES["QQ"] = ".js";
    SCRIPT_TYPES["JD"] = ".js";
})(SCRIPT_TYPES = exports.SCRIPT_TYPES || (exports.SCRIPT_TYPES = {}));
var CONFIG_TYPES;
(function (CONFIG_TYPES) {
    CONFIG_TYPES["WEAPP"] = ".json";
    CONFIG_TYPES["SWAN"] = ".json";
    CONFIG_TYPES["ALIPAY"] = ".json";
    CONFIG_TYPES["TT"] = ".json";
    CONFIG_TYPES["QUICKAPP"] = ".json";
    CONFIG_TYPES["QQ"] = ".json";
    CONFIG_TYPES["JD"] = ".json";
})(CONFIG_TYPES = exports.CONFIG_TYPES || (exports.CONFIG_TYPES = {}));
exports.MINI_APP_FILES = {
    ["weapp" /* WEAPP */]: {
        TEMPL: ".wxml" /* WEAPP */,
        STYLE: ".wxss" /* WEAPP */,
        SCRIPT: ".js" /* WEAPP */,
        CONFIG: ".json" /* WEAPP */
    },
    ["swan" /* SWAN */]: {
        TEMPL: ".swan" /* SWAN */,
        STYLE: ".css" /* SWAN */,
        SCRIPT: ".js" /* SWAN */,
        CONFIG: ".json" /* SWAN */
    },
    ["alipay" /* ALIPAY */]: {
        TEMPL: ".axml" /* ALIPAY */,
        STYLE: ".acss" /* ALIPAY */,
        SCRIPT: ".js" /* ALIPAY */,
        CONFIG: ".json" /* ALIPAY */
    },
    ["tt" /* TT */]: {
        TEMPL: ".ttml" /* TT */,
        STYLE: ".ttss" /* TT */,
        SCRIPT: ".js" /* TT */,
        CONFIG: ".json" /* TT */
    },
    ["quickapp" /* QUICKAPP */]: {
        TEMPL: ".ux" /* QUICKAPP */,
        STYLE: ".css" /* QUICKAPP */,
        SCRIPT: ".js" /* QUICKAPP */,
        CONFIG: ".json" /* QUICKAPP */
    },
    ["qq" /* QQ */]: {
        TEMPL: ".qml" /* QQ */,
        STYLE: ".qss" /* QQ */,
        SCRIPT: ".js" /* QQ */,
        CONFIG: ".json" /* QQ */
    },
    ["jd" /* JD */]: {
        TEMPL: ".jxml" /* JD */,
        STYLE: ".jxss" /* JD */,
        SCRIPT: ".js" /* JD */,
        CONFIG: ".json" /* JD */
    }
};
exports.CONFIG_MAP = {
    ["weapp" /* WEAPP */]: {
        navigationBarTitleText: 'navigationBarTitleText',
        navigationBarBackgroundColor: 'navigationBarBackgroundColor',
        enablePullDownRefresh: 'enablePullDownRefresh',
        list: 'list',
        text: 'text',
        iconPath: 'iconPath',
        selectedIconPath: 'selectedIconPath',
        color: 'color'
    },
    ["swan" /* SWAN */]: {
        navigationBarTitleText: 'navigationBarTitleText',
        navigationBarBackgroundColor: 'navigationBarBackgroundColor',
        enablePullDownRefresh: 'enablePullDownRefresh',
        list: 'list',
        text: 'text',
        iconPath: 'iconPath',
        selectedIconPath: 'selectedIconPath',
        color: 'color'
    },
    ["tt" /* TT */]: {
        navigationBarTitleText: 'navigationBarTitleText',
        navigationBarBackgroundColor: 'navigationBarBackgroundColor',
        enablePullDownRefresh: 'enablePullDownRefresh',
        list: 'list',
        text: 'text',
        iconPath: 'iconPath',
        selectedIconPath: 'selectedIconPath',
        color: 'color'
    },
    ["alipay" /* ALIPAY */]: {
        navigationBarTitleText: 'defaultTitle',
        navigationBarBackgroundColor: 'titleBarColor',
        enablePullDownRefresh: 'pullRefresh',
        list: 'items',
        text: 'name',
        iconPath: 'icon',
        selectedIconPath: 'activeIcon',
        color: 'textColor'
    },
    ["quickapp" /* QUICKAPP */]: {
        navigationBarTitleText: 'titleBarText',
        navigationBarBackgroundColor: 'titleBarBackgroundColor',
        navigationBarTextStyle: 'titleBarTextColor',
        pageOrientation: 'orientation',
        list: 'list',
        text: 'text',
        iconPath: 'iconPath',
        selectedIconPath: 'selectedIconPath',
        backgroundTextStyle: false,
        onReachBottomDistance: false,
        backgroundColorBottom: false,
        backgroundColorTop: false,
        navigationStyle: 'navigationStyle'
    },
    ["qq" /* QQ */]: {
        navigationBarTitleText: 'navigationBarTitleText',
        navigationBarBackgroundColor: 'navigationBarBackgroundColor',
        enablePullDownRefresh: 'enablePullDownRefresh',
        list: 'list',
        text: 'text',
        iconPath: 'iconPath',
        selectedIconPath: 'selectedIconPath',
        color: 'color'
    },
    ["jd" /* JD */]: {
        navigationBarTitleText: 'navigationBarTitleText',
        navigationBarBackgroundColor: 'navigationBarBackgroundColor',
        enablePullDownRefresh: 'enablePullDownRefresh',
        list: 'list',
        text: 'text',
        iconPath: 'iconPath',
        selectedIconPath: 'selectedIconPath',
        color: 'color'
    }
};
exports.taroJsComponents = '@tarojs/components';
exports.taroJsQuickAppComponents = '@tarojs/components-qa';
exports.taroJsFramework = '@tarojs/taro';
exports.taroJsRedux = '@tarojs/redux';
exports.taroJsMobx = '@tarojs/mobx';
exports.taroJsMobxCommon = '@tarojs/mobx-common';
exports.DEVICE_RATIO_NAME = 'deviceRatio';
exports.isWindows = os.platform() === 'win32';
exports.QUICKAPP_SPECIAL_COMPONENTS = new Set([
    'View',
    'Text'
]);
var PARSE_AST_TYPE;
(function (PARSE_AST_TYPE) {
    PARSE_AST_TYPE["ENTRY"] = "ENTRY";
    PARSE_AST_TYPE["PAGE"] = "PAGE";
    PARSE_AST_TYPE["COMPONENT"] = "COMPONENT";
    PARSE_AST_TYPE["NORMAL"] = "NORMAL";
    PARSE_AST_TYPE["STATIC"] = "STATIC";
})(PARSE_AST_TYPE = exports.PARSE_AST_TYPE || (exports.PARSE_AST_TYPE = {}));
var processTypeEnum;
(function (processTypeEnum) {
    processTypeEnum["START"] = "start";
    processTypeEnum["CREATE"] = "create";
    processTypeEnum["COMPILE"] = "compile";
    processTypeEnum["CONVERT"] = "convert";
    processTypeEnum["COPY"] = "copy";
    processTypeEnum["GENERATE"] = "generate";
    processTypeEnum["MODIFY"] = "modify";
    processTypeEnum["ERROR"] = "error";
    processTypeEnum["WARNING"] = "warning";
    processTypeEnum["UNLINK"] = "unlink";
    processTypeEnum["REFERENCE"] = "reference";
})(processTypeEnum = exports.processTypeEnum || (exports.processTypeEnum = {}));
exports.processTypeMap = {
    ["create" /* CREATE */]: {
        name: '创建',
        color: 'cyan'
    },
    ["compile" /* COMPILE */]: {
        name: '编译',
        color: 'green'
    },
    ["convert" /* CONVERT */]: {
        name: '转换',
        color: chalk_1.default.rgb(255, 136, 0)
    },
    ["copy" /* COPY */]: {
        name: '拷贝',
        color: 'magenta'
    },
    ["generate" /* GENERATE */]: {
        name: '生成',
        color: 'blue'
    },
    ["modify" /* MODIFY */]: {
        name: '修改',
        color: 'yellow'
    },
    ["error" /* ERROR */]: {
        name: '错误',
        color: 'red'
    },
    ["warning" /* WARNING */]: {
        name: '警告',
        color: 'yellowBright'
    },
    ["unlink" /* UNLINK */]: {
        name: '删除',
        color: 'magenta'
    },
    ["start" /* START */]: {
        name: '启动',
        color: 'green'
    },
    ["reference" /* REFERENCE */]: {
        name: '引用',
        color: 'blue'
    }
};
exports.excludeReplaceTaroFrameworkPkgs = new Set([exports.taroJsRedux, exports.taroJsMobx, exports.taroJsMobxCommon]);
exports.GLOBAL_PROPS = '{Function: Function,Boolean: Boolean,Object: Object,Number: Number,Array: Array,Date: Date,String: String,Symbol: Symbol,Error: Error,TypeError: TypeError,Map: Map,Set: Set,WeakMap: WeakMap,WeakSet: WeakSet,ArrayBuffer: ArrayBuffer,Math: Math,Promise: Promise,RegExp: RegExp,DataView: DataView,isFinite: isFinite,parseInt: parseInt,parseFloat: parseFloat,Float32Array: Float32Array,Float64Array: Float64Array,Int8Array: Int8Array,Int16Array: Int16Array,Int32Array: Int32Array,Uint8Array: Uint8Array,Uint16Array: Uint16Array,Uint32Array: Uint32Array,Uint8ClampedArray: Uint8ClampedArray,setTimeout: setTimeout,clearTimeout: clearTimeout,setInterval: setInterval,clearInterval: clearInterval}';
