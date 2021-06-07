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
exports.readPost = exports.readPublishedPosts = exports.deletePost = exports.updatePost = exports.createPost = void 0;
var client_1 = require("@prisma/client");
var errorHandler_1 = require("../../errorHandler/errorHandler");
var dataHelper_1 = require("../../Helpers/dataHelper");
var prisma = new client_1.PrismaClient();
var createPost = function (authorId, params) { return __awaiter(void 0, void 0, void 0, function () {
    var today, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                today = new Date();
                return [4 /*yield*/, prisma.post.create({
                        data: __assign(__assign({}, params), { createdAt: today, published: params.published != null ? params.published : true, likesQuantity: 0, authorId: dataHelper_1.fixId(authorId) }),
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/, { result: null, status: 204 }];
            case 2:
                e_1 = _a.sent();
                console.log(e_1.message);
                throw new errorHandler_1.ErrorHandler('ERROR: cant create post', 404, e_1.message);
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createPost = createPost;
var updatePost = function (id, postId, params) { return __awaiter(void 0, void 0, void 0, function () {
    var postToUpdate, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                return [4 /*yield*/, prisma.post.findFirst({
                        where: {
                            id: dataHelper_1.fixId(postId),
                        },
                    })];
            case 1:
                postToUpdate = _a.sent();
                if (postToUpdate == null) {
                    return [2 /*return*/, {
                            result: 'cant update a post that does not exist ',
                            status: 404,
                        }];
                }
                return [4 /*yield*/, prisma.post.findFirst({
                        where: {
                            id: dataHelper_1.fixId(postId),
                            authorId: dataHelper_1.fixId(id),
                        },
                    })];
            case 2:
                postToUpdate = _a.sent();
                if (postToUpdate == null) {
                    return [2 /*return*/, {
                            result: 'cant update post because does not belongs to user',
                            status: 404,
                        }];
                }
                return [4 /*yield*/, prisma.post.update({
                        where: {
                            id: dataHelper_1.fixId(postId),
                        },
                        data: __assign({}, params),
                    })];
            case 3:
                _a.sent();
                return [2 /*return*/, { result: null, status: 204 }];
            case 4:
                e_2 = _a.sent();
                console.log(e_2.message);
                throw new errorHandler_1.ErrorHandler('ERROR: cant update post', 404, e_2.message);
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.updatePost = updatePost;
var deletePost = function (id, postId) { return __awaiter(void 0, void 0, void 0, function () {
    var postToDelete, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                return [4 /*yield*/, prisma.post.findFirst({
                        where: {
                            id: dataHelper_1.fixId(postId),
                        },
                    })];
            case 1:
                postToDelete = _a.sent();
                if (postToDelete == null) {
                    return [2 /*return*/, {
                            result: 'cant delete a post that does not exist',
                            status: 404,
                        }];
                }
                return [4 /*yield*/, prisma.post.findFirst({
                        where: {
                            id: dataHelper_1.fixId(postId),
                            authorId: dataHelper_1.fixId(id),
                        },
                    })];
            case 2:
                postToDelete = _a.sent();
                if (postToDelete == null) {
                    return [2 /*return*/, {
                            result: 'cant delete a post that does not belongs to user',
                            status: 404,
                        }];
                }
                return [4 /*yield*/, prisma.post.delete({
                        where: {
                            id: dataHelper_1.fixId(postId),
                        },
                    })];
            case 3:
                _a.sent();
                return [2 /*return*/, { result: postToDelete, status: 200 }];
            case 4:
                e_3 = _a.sent();
                console.log(e_3.message);
                throw new errorHandler_1.ErrorHandler('ERROR: cant delete post', 404, e_3.message);
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.deletePost = deletePost;
var readPublishedPosts = function () { return __awaiter(void 0, void 0, void 0, function () {
    var posts, e_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.post.findMany({
                        where: {
                            published: true,
                        },
                    })];
            case 1:
                posts = _a.sent();
                if (posts.length == 0) {
                    return [2 /*return*/, { result: null, status: 404 }];
                }
                return [2 /*return*/, { result: posts, status: 200 }];
            case 2:
                e_4 = _a.sent();
                throw new errorHandler_1.ErrorHandler('ERROR: cant get posts', 404, e_4.message);
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.readPublishedPosts = readPublishedPosts;
var readPost = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var post, e_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.post.findFirst({
                        where: {
                            id: dataHelper_1.fixId(id),
                        },
                    })];
            case 1:
                post = _a.sent();
                if (post == null) {
                    return [2 /*return*/, {
                            result: 'post that does not exist',
                            status: 404,
                        }];
                }
                return [2 /*return*/, { result: post, status: 200 }];
            case 2:
                e_5 = _a.sent();
                throw new errorHandler_1.ErrorHandler('ERROR: cant read post', 404, e_5.message);
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.readPost = readPost;
