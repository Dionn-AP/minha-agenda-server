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
class Passwords {
    getPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { password } = req.body;
            const id = req.userId;
            if (!password) {
                return res.status(400).json({ message: 'Informe sua senha atual' });
            }
            try {
                const user = yield Users_1.default.findById(id);
                const correctPassword = yield bcrypt.compare(password, user === null || user === void 0 ? void 0 : user.password);
                if (!correctPassword) {
                    return res.status(404).json({ message: "Senha incorreta" });
                }
                res.status(200).json({ message: "Senha correta" });
            }
            catch (error) {
                return res.status(400).json(error);
            }
        });
    }
    changePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { password, confirm_password } = req.body;
            const id = req.userId;
            if (!password || !confirm_password) {
                return res.status(404).json({ message: 'Você precisa informar a nova senha' });
            }
            if (!password || confirm_password) {
                return res.status(404).json({ message: 'Você precisa confirmar a nova senha' });
            }
            if (password !== confirm_password) {
                return res.status(404).json({ message: 'As senhas precisam ser iguais' });
            }
            const salt = yield bcrypt.genSalt(12);
            const passwordHash = yield bcrypt.hash(password, salt);
            try {
                const updatedPassword = yield Users_1.default.updateOne({ _id: id }, { $set: { password: passwordHash } });
                if (!updatedPassword) {
                    return res.status(404).json({ message: 'não foi possível atualizar sua senha' });
                }
                res.status(200).json({ message: "Senha alterada com sucesso" });
            }
            catch (error) {
                return res.status(400).json(error);
            }
        });
    }
}
exports.default = new Passwords();
