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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.user_login = void 0;
const dotenv = require('dotenv');
dotenv.config();
const db_1 = __importDefault(require("../db"));
const PORT = process.env.PORT || 4000;
const SECRET_KEY = process.env.SECRET_KEY || 'test';
// 1. POST: Авторизация пользователя
const user_login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    if (username && password) {
        const user = yield db_1.default.any('SELECT username FROM man.users WHERE password_hash = $1', [password]);
        console.log(user);
    }
});
exports.user_login = user_login;
