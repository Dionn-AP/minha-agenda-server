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
const Users_1 = __importDefault(require("../models/Users"));
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
class Login {
    authenticate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            if (!email && password) {
                return res.status(422).json({ message: 'Você precisa informar um email.' });
            }
            if (email && !password) {
                return res.status(422).json({ message: 'Você precisa informar uma senha.' });
            }
            if (!email && !password) {
                return res.status(422).json({ message: 'Você precisa informar um email e senha.' });
            }
            const user = yield Users_1.default.findOne({ email: email });
            if (!user) {
                return res.status(404).json({ message: "Usuário não encontrado." });
            }
            const dataUser = {
                id: user._id,
                name: user.name,
                email: user.email
            };
            const checkPassword = yield bcrypt.compare(password, user.password);
            if (!checkPassword) {
                return res.status(422).json({ message: "Email ou senha inválidos" });
            }
            try {
                const secret = process.env.SECRET_KEY;
                const token = jwt.sign({ id: user._id, }, `${secret}`, { expiresIn: '5h' });
                res.status(200).json(Object.assign(Object.assign({}, dataUser), { token }));
            }
            catch (error) {
                return res.status(500).json(error);
            }
        });
    }
}
exports.default = new Login();
