<<<<<<< HEAD
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
exports.readComment = exports.readPublishedComments = exports.deleteComment = exports.updateComment = exports.createComment = void 0;
var client_1 = require("@prisma/client");
var errorHandler_1 = require("../../errorHandler/errorHandler");
var dataHelper_1 = require("../../Helpers/dataHelper");
var prisma = new client_1.PrismaClient();
var createComment = function (authorId, postId, params) { return __awaiter(void 0, void 0, void 0, function () {
    var today, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                today = new Date();
                return [4 /*yield*/, prisma.comment.create({
                        data: __assign(__assign({}, params), { createdAt: today, published: params.published != null ? params.published : true, likesQuantity: 0, authorId: dataHelper_1.fixId(authorId), postId: dataHelper_1.fixId(postId) }),
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/, { result: null, status: 204 }];
            case 2:
                e_1 = _a.sent();
                console.log(e_1.message);
                throw new errorHandler_1.ErrorHandler('ERROR: cant create comment', 404, e_1.message);
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createComment = createComment;
var updateComment = function (id, postId, commentId, params) { return __awaiter(void 0, void 0, void 0, function () {
    var commentToUpdate, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                return [4 /*yield*/, prisma.comment.findFirst({
                        where: {
                            id: dataHelper_1.fixId(commentId),
                        },
                    })];
            case 1:
                commentToUpdate = _a.sent();
                if (commentToUpdate == null) {
                    return [2 /*return*/, {
                            result: 'cant update a comment that does not exist ',
                            status: 404,
                        }];
                }
                return [4 /*yield*/, prisma.comment.findFirst({
                        where: {
                            id: dataHelper_1.fixId(commentId),
                            postId: dataHelper_1.fixId(postId),
                        },
                    })];
            case 2:
                commentToUpdate = _a.sent();
                if (commentToUpdate == null) {
                    return [2 /*return*/, {
                            result: 'cant update comment because its not related to post',
                            status: 404,
                        }];
                }
                return [4 /*yield*/, prisma.comment.findFirst({
                        where: {
                            id: dataHelper_1.fixId(commentId),
                            postId: dataHelper_1.fixId(postId),
                            authorId: dataHelper_1.fixId(id),
                        },
                    })];
            case 3:
                commentToUpdate = _a.sent();
                if (commentToUpdate == null) {
                    return [2 /*return*/, {
                            result: 'cant update comment that does not belongs to user',
                            status: 404,
                        }];
                }
                return [4 /*yield*/, prisma.comment.update({
                        where: {
                            id: dataHelper_1.fixId(commentId),
                        },
                        data: __assign({}, params),
                    })];
            case 4:
                _a.sent();
                return [2 /*return*/, { result: null, status: 204 }];
            case 5:
                e_2 = _a.sent();
                console.log(e_2.message);
                throw new errorHandler_1.ErrorHandler('ERROR: cant update comment', 404, e_2.message);
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.updateComment = updateComment;
var deleteComment = function (id, postId, commentId) { return __awaiter(void 0, void 0, void 0, function () {
    var commentToDelete, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                return [4 /*yield*/, prisma.comment.findFirst({
                        where: {
                            id: dataHelper_1.fixId(commentId),
                        },
                    })];
            case 1:
                commentToDelete = _a.sent();
                if (commentToDelete == null) {
                    return [2 /*return*/, {
                            result: 'cant delete a comment that does not exist',
                            status: 404,
                        }];
                }
                return [4 /*yield*/, prisma.comment.findFirst({
                        where: {
                            id: dataHelper_1.fixId(commentId),
                            postId: dataHelper_1.fixId(postId),
                        },
                    })];
            case 2:
                commentToDelete = _a.sent();
                if (commentToDelete == null) {
                    return [2 /*return*/, {
                            result: 'cant delete comment because its not related to post',
                            status: 404,
                        }];
                }
                return [4 /*yield*/, prisma.comment.findFirst({
                        where: {
                            id: dataHelper_1.fixId(commentId),
                            postId: dataHelper_1.fixId(postId),
                            authorId: dataHelper_1.fixId(id),
                        },
                    })];
            case 3:
                commentToDelete = _a.sent();
                if (commentToDelete == null) {
                    return [2 /*return*/, {
                            result: 'cant delete a comment that does not belongs to user',
                            status: 404,
                        }];
                }
                return [4 /*yield*/, prisma.comment.delete({
                        where: {
                            id: dataHelper_1.fixId(commentId),
                        },
                    })];
            case 4:
                _a.sent();
                return [2 /*return*/, { result: commentToDelete, status: 200 }];
            case 5:
                e_3 = _a.sent();
                console.log(e_3.message);
                throw new errorHandler_1.ErrorHandler('ERROR: cant delete comment', 404, e_3.message);
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.deleteComment = deleteComment;
var readPublishedComments = function (postId) { return __awaiter(void 0, void 0, void 0, function () {
    var comments, e_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.comment.findMany({
                        where: {
                            published: true,
                            postId: dataHelper_1.fixId(postId),
                        },
                    })];
            case 1:
                comments = _a.sent();
                if (comments.length == 0) {
                    return [2 /*return*/, { result: null, status: 404 }];
                }
                return [2 /*return*/, { result: comments, status: 200 }];
            case 2:
                e_4 = _a.sent();
                throw new errorHandler_1.ErrorHandler('ERROR: cant get comments', 404, e_4.message);
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.readPublishedComments = readPublishedComments;
var readComment = function (postId, commentId) { return __awaiter(void 0, void 0, void 0, function () {
    var comment, e_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, prisma.comment.findFirst({
                        where: {
                            id: dataHelper_1.fixId(commentId),
                        },
                    })];
            case 1:
                comment = _a.sent();
                if (comment == null) {
                    return [2 /*return*/, {
                            result: 'comment that does not exist',
                            status: 404,
                        }];
                }
                return [4 /*yield*/, prisma.comment.findFirst({
                        where: {
                            id: dataHelper_1.fixId(commentId),
                            postId: dataHelper_1.fixId(postId),
                        },
                    })];
            case 2:
                comment = _a.sent();
                if (comment == null) {
                    return [2 /*return*/, {
                            result: 'comment is not related to post',
                            status: 404,
                        }];
                }
                return [2 /*return*/, { result: comment, status: 200 }];
            case 3:
                e_5 = _a.sent();
                throw new errorHandler_1.ErrorHandler('ERROR: cant read comment', 404, e_5.message);
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.readComment = readComment;
=======
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
exports.readComment = exports.readPublishedComments = exports.deleteComment = exports.updateComment = exports.createComment = void 0;
var client_1 = require("@prisma/client");
var errorHandler_1 = require("../../errorHandler/errorHandler");
var dataHelper_1 = require("../../Helpers/dataHelper");
var prisma = new client_1.PrismaClient();
var createComment = function (authorId, params) { return __awaiter(void 0, void 0, void 0, function () {
    var today, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                today = new Date();
                return [4 /*yield*/, prisma.comment.create({
                        data: __assign(__assign({}, params), { createdAt: today, published: params.published != null ? params.published : true, likesQuantity: 0, authorId: dataHelper_1.fixId(authorId) }),
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/, { result: null, status: 204 }];
            case 2:
                e_1 = _a.sent();
                console.log(e_1.message);
                throw new errorHandler_1.ErrorHandler('ERROR: cant create comment', 404, e_1.message);
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createComment = createComment;
var updateComment = function (id, commentId, params) { return __awaiter(void 0, void 0, void 0, function () {
    var commentToUpdate, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                return [4 /*yield*/, prisma.comment.findFirst({
                        where: {
                            id: dataHelper_1.fixId(commentId),
                        },
                    })];
            case 1:
                commentToUpdate = _a.sent();
                if (commentToUpdate == null) {
                    return [2 /*return*/, {
                            result: 'cant update a comment that does not exist ',
                            status: 404,
                        }];
                }
                return [4 /*yield*/, prisma.comment.findFirst({
                        where: {
                            id: dataHelper_1.fixId(commentId),
                            authorId: dataHelper_1.fixId(id),
                        },
                    })];
            case 2:
                commentToUpdate = _a.sent();
                if (commentToUpdate == null) {
                    return [2 /*return*/, {
                            result: 'cant update comment because does not belongs to user',
                            status: 404,
                        }];
                }
                return [4 /*yield*/, prisma.comment.update({
                        where: {
                            id: dataHelper_1.fixId(commentId),
                        },
                        data: __assign({}, params),
                    })];
            case 3:
                _a.sent();
                return [2 /*return*/, { result: null, status: 204 }];
            case 4:
                e_2 = _a.sent();
                console.log(e_2.message);
                throw new errorHandler_1.ErrorHandler('ERROR: cant update comment', 404, e_2.message);
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.updateComment = updateComment;
var deleteComment = function (id, commentId) { return __awaiter(void 0, void 0, void 0, function () {
    var commentToDelete, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                return [4 /*yield*/, prisma.comment.findFirst({
                        where: {
                            id: dataHelper_1.fixId(commentId),
                        },
                    })];
            case 1:
                commentToDelete = _a.sent();
                if (commentToDelete == null) {
                    return [2 /*return*/, {
                            result: 'cant delete a comment that does not exist',
                            status: 404,
                        }];
                }
                return [4 /*yield*/, prisma.comment.findFirst({
                        where: {
                            id: dataHelper_1.fixId(commentId),
                            authorId: dataHelper_1.fixId(id),
                        },
                    })];
            case 2:
                commentToDelete = _a.sent();
                if (commentToDelete == null) {
                    return [2 /*return*/, {
                            result: 'cant delete a comment that does not belongs to user',
                            status: 404,
                        }];
                }
                return [4 /*yield*/, prisma.comment.delete({
                        where: {
                            id: dataHelper_1.fixId(commentId),
                        },
                    })];
            case 3:
                _a.sent();
                return [2 /*return*/, { result: commentToDelete, status: 200 }];
            case 4:
                e_3 = _a.sent();
                console.log(e_3.message);
                throw new errorHandler_1.ErrorHandler('ERROR: cant delete comment', 404, e_3.message);
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.deleteComment = deleteComment;
var readPublishedComments = function () { return __awaiter(void 0, void 0, void 0, function () {
    var comments, e_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.comment.findMany({
                        where: {
                            published: true,
                        },
                    })];
            case 1:
                comments = _a.sent();
                if (comments.length == 0) {
                    return [2 /*return*/, { result: null, status: 404 }];
                }
                return [2 /*return*/, { result: comments, status: 200 }];
            case 2:
                e_4 = _a.sent();
                throw new errorHandler_1.ErrorHandler('ERROR: cant get comments', 404, e_4.message);
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.readPublishedComments = readPublishedComments;
var readComment = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var comment, e_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.comment.findFirst({
                        where: {
                            id: dataHelper_1.fixId(id),
                        },
                    })];
            case 1:
                comment = _a.sent();
                if (comment == null) {
                    return [2 /*return*/, {
                            result: 'comment that does not exist',
                            status: 404,
                        }];
                }
                return [2 /*return*/, { result: comment, status: 200 }];
            case 2:
                e_5 = _a.sent();
                throw new errorHandler_1.ErrorHandler('ERROR: cant read comment', 404, e_5.message);
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.readComment = readComment;
>>>>>>> f6c64be4d3d6cd5088568e8353dfcb6bcbd771bc
