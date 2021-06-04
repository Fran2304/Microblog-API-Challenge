"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var controller = function (req, res) {
    res.send({ me: 'comments' });
};
var router = express_1.Router();
// /api/account
router.route('/').get(controller).post(controller);
// /api/account:id
router.route('/:id').put(controller).delete(controller).get(controller);
exports.default = router;
