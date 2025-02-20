"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authControlles_1 = require("../controllers/authControlles");
const router = express_1.default.Router();
router.post('/login', authControlles_1.user_login);
exports.default = router;
