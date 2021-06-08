"use strict";
/* eslint-disable no-undef */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var devEnv = __importStar(require("./dev"));
var testEnv = __importStar(require("./test"));
var env = process.env.PORT || 'development';
var baseConfig = {
    env: env,
    isDev: env === 'development',
    isTest: env === 'testing',
    port: 3002,
    secrets: {
        jwt: process.env.JWT_SECRET,
        jwtExp: '100d',
    },
};
var envConfig = {};
switch (env) {
    case 'dev':
    case 'development':
        envConfig = devEnv.config;
        break;
    case 'test':
    case 'testing':
        envConfig = testEnv.config;
        break;
    default:
        envConfig = devEnv.config;
}
exports.default = lodash_1.merge(baseConfig, envConfig);
//# sourceMappingURL=index.js.map