"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.signin = exports.signup = exports.verifyToken = exports.newToken = void 0;
// import express, { NextFunction } from 'express'
var userService = __importStar(require("../services/users/crudUserService"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var config_1 = __importDefault(require("../../config"));
// import { PrismaClient } from '@prisma/client' // protect
// const prisma = new PrismaClient() // protect
// interface IPayload {
//     sub: string
//     id: number
//     iat: string
// }
var newToken = function (userId) {
    return jsonwebtoken_1.default.sign({ id: userId }, config_1.default.secrets.jwt, {
        expiresIn: config_1.default.secrets.jwtExp,
    });
};
exports.newToken = newToken;
// ojito con el type token
var verifyToken = function (token) {
    return new Promise(function (resolve, reject) {
        jsonwebtoken_1.default.verify(token, config_1.default.secrets.jwt, function (err, payload) {
            if (err)
                return reject(err);
            resolve(payload);
        });
    });
};
exports.verifyToken = verifyToken;
var signup = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, token, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.body.email || !req.body.password) {
                    return [2 /*return*/, res.status(400).send({ message: 'need email and password' })];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, userService.createUserService(req.body)];
            case 2:
                user = _a.sent();
                token = exports.newToken(user.result.id);
                return [2 /*return*/, res
                        .status(user.status)
                        .json({ mensaje: 'Complete registration', token: token })];
            case 3:
                e_1 = _a.sent();
                console.error(e_1);
                return [2 /*return*/, res.status(500).end()];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.signup = signup;
var signin = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var invalid, user, token, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.body.email || !req.body.password) {
                    return [2 /*return*/, res.status(400).send({ message: 'need email and password' })];
                }
                invalid = { message: 'Invalid email and passoword combination' };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, userService.readUserService(req.body)];
            case 2:
                user = _a.sent();
                if (!user.result) {
                    return [2 /*return*/, res.status(401).send(invalid)];
                }
                token = exports.newToken(user.result);
                return [2 /*return*/, res
                        .status(201)
                        .json({ mensaje: 'Autenticación correcta', token: token })];
            case 3:
                e_2 = _a.sent();
                console.error(e_2);
                res.status(500).end();
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.signin = signin;
var updateUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var updatedUser, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, userService.updateUserService(req.params.id, req.body)];
            case 1:
                updatedUser = _a.sent();
                res.status(updatedUser.status).json({ message: updatedUser.status });
                return [3 /*break*/, 3];
            case 2:
                e_3 = _a.sent();
                console.error(e_3);
                res.status(400).end();
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.updateUser = updateUser;
// export const protect = async (req: express.Request, res: express. Response, next: NextFunction) => {
//     const token = req.headers ['access-token'];
//     if (token) {
//       jwt.verify (token, app.get('secrets'), (err , decoded) => {
//         if (err) {
//           return res.json ({mensaje: 'Token inválida'});
//         } else {
//           req.body.user = user;
//           next ();
//         }
//       });
//     } else {
//       res.send ( {
//           mensaje: 'Token no proveída.'
//       });
//     }
// };
// export const protect = async (
//     req: express.Request,
//     res: express.Response,
//     next: NextFunction
// ) => {
//     const bearer = req.headers.authorization
//     if (!bearer || !bearer.startsWith('Bearer ')) {
//         return res.status(401).end()
//     }
//     const token = bearer.split('Bearer ')[1]
//     let payload
//     try {
//         payload = await verifyToken(token)
//     } catch (e) {
//         return res.status(401).end()
//     }
//     const user = await prisma.user.findUnique({
//         where: {
//             id: payload.id,
//         },
//     })
//     if (!user) {
//         return res.status(401).end()
//     }
//     req.body.user = user
//     next()
// }
//# sourceMappingURL=user.controllers.js.map