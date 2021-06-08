"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.showNameUserService = exports.showEmailUserService = exports.updateUserService = exports.readUserService = exports.createUserService = void 0;
var client_1 = require("@prisma/client");
var errorHandler_1 = require("../../errorHandler/errorHandler");
var dataHelper_1 = require("../../Helpers/dataHelper");
var prisma = new client_1.PrismaClient();
var createUserService = function (params) { return __awaiter(void 0, void 0, void 0, function () {
    var createdUser, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.user.create({
                        data: __assign({}, params),
                    })];
            case 1:
                createdUser = _a.sent();
                return [2 /*return*/, { result: createdUser, status: 201 }];
            case 2:
                e_1 = _a.sent();
                throw new errorHandler_1.ErrorHandler('cant create users', 404, e_1.message);
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createUserService = createUserService;
var readUserService = function (params) { return __awaiter(void 0, void 0, void 0, function () {
    var readUser, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.user.findUnique({
                        where: {
                            email: params.email,
                        },
                    })];
            case 1:
                readUser = _a.sent();
                return [2 /*return*/, { result: readUser === null || readUser === void 0 ? void 0 : readUser.id, status: 200 }];
            case 2:
                e_2 = _a.sent();
                throw new errorHandler_1.ErrorHandler('cant get user', 404, e_2.message);
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.readUserService = readUserService;
var updateUserService = function (id, params) { return __awaiter(void 0, void 0, void 0, function () {
    var e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.user.update({
                        where: {
                            id: dataHelper_1.fixId(id),
                        },
                        data: __assign({}, params),
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/, { result: null, status: 204 }];
            case 2:
                e_3 = _a.sent();
                throw new errorHandler_1.ErrorHandler('cant update comment', 404, e_3.message);
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.updateUserService = updateUserService;
var showEmailUserService = function (id, visibleEmail) { return __awaiter(void 0, void 0, void 0, function () {
    var e_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.user.update({
                        where: {
                            id: dataHelper_1.fixId(id),
                        },
                        data: {
                            visibleEmail: visibleEmail,
                        },
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/, { result: null, status: 204 }];
            case 2:
                e_4 = _a.sent();
                throw new errorHandler_1.ErrorHandler('cant update comment', 404, e_4.message);
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.showEmailUserService = showEmailUserService;
var showNameUserService = function (id, visibleName) { return __awaiter(void 0, void 0, void 0, function () {
    var e_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.user.update({
                        where: {
                            id: dataHelper_1.fixId(id),
                        },
                        data: {
                            visibleName: visibleName,
                        },
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/, { result: null, status: 204 }];
            case 2:
                e_5 = _a.sent();
                throw new errorHandler_1.ErrorHandler('cant update comment', 404, e_5.message);
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.showNameUserService = showNameUserService;
// export const getAllUsers = async () => {
//     const users = await prisma.user.findMany({})
//     return { result: users, status: 200 }
// }
//# sourceMappingURL=crudUserService.js.map