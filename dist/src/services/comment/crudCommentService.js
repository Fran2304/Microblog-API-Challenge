            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.comment.create({
                        data: __assign(__assign({}, params), { likesQuantity: 0 }),
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/, { result: null, status: 204 }];
            case 2:
                e_2 = _a.sent();
                throw new errorHandler_1.ErrorHandler('cant create comment', 404, e_2.message);
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createComment = createComment;
var updateComment = function (id, content) { return __awaiter(void 0, void 0, void 0, function () {
    var e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.comment.update({
                        where: {
                            id: dataHelper_1.fixId(id),
                        },
                        data: {
                            content: content,
                        },
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
exports.updateComment = updateComment;
var deleteComment = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var commentToDelete, e_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, prisma.comment.findFirst({
                        where: {
                            id: dataHelper_1.fixId(id),
                        },
                    })];
            case 1:
                commentToDelete = _a.sent();
                return [4 /*yield*/, prisma.comment.delete({
                        where: {
                            id: dataHelper_1.fixId(id),
                        },
                    })];
            case 2:
                _a.sent();
                return [2 /*return*/, { result: commentToDelete, status: 200 }];
            case 3:
                e_4 = _a.sent();
                throw new errorHandler_1.ErrorHandler('cant delete comment', 404, e_4.message);
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.deleteComment = deleteComment;
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
                return [2 /*return*/, { result: comment, status: 200 }];
            case 2:
                e_5 = _a.sent();
                throw new errorHandler_1.ErrorHandler('cant read comment', 404, e_5.message);
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.readComment = readComment;
