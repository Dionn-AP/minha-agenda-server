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
const ConfirmPass_1 = __importDefault(require("../models/ConfirmPass"));
const Companies_Service_1 = __importDefault(require("../models/Companies_Service"));
const bcrypt = require('bcrypt');
const transporterMail = require("../config/smtp");
class Usercontroller {
    createuser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, password, phone, road, district, complement, post, number_address, city, state, code } = req.body;
            if (!code) {
                return res.status(422).json({ message: 'Você precisa informar o código recebido por email' });
            }
            const userExists = yield Users_1.default.findOne({ email: email });
            if (userExists) {
                return res.status(422).json({ message: "Por favor, utilize outro e-mail" });
            }
            const salt = yield bcrypt.genSalt(12);
            const passwordHash = yield bcrypt.hash(password, salt);
            const dataUser = {
                name,
                email,
                password: passwordHash,
                phone: phone ? phone : "",
                road: road ? road : "",
                district: district ? district : "",
                complement: complement ? complement : "",
                post: post ? post : "",
                number_address: number_address ? number_address : null,
                city: city ? city : "",
                state: state ? state : "",
                code
            };
            try {
                const codePass = yield ConfirmPass_1.default.findOne({ email: email });
                const dataCreated = new Date(codePass === null || codePass === void 0 ? void 0 : codePass.createdAt).getMinutes();
                const dataNow = new Date().getMinutes();
                if ((codePass === null || codePass === void 0 ? void 0 : codePass.code) !== code) {
                    return res.status(422).json({ message: "O código informado está incorreto" });
                }
                if ((dataNow - dataCreated) > 5) {
                    return res.status(422).json({ message: "O código expirou. Reenvie para obter um novo código de confirmação" });
                }
                if ((codePass === null || codePass === void 0 ? void 0 : codePass.code) === code) {
                    const newUser = yield Users_1.default.create(dataUser);
                    return res.status(201).json({ message: "Cadastro concluído com sucesso" });
                }
            }
            catch (error) {
                return res.status(404).json(error);
            }
        });
    }
    user(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.userId;
            try {
                const user = yield Users_1.default.findById(id, '-password');
                if (!user) {
                    return res.status(422).json({ message: 'O usuário não foi encontrado!' });
                }
                res.status(200).json(user);
            }
            catch (error) {
                return res.status(422).json(error);
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.userId;
            const { name, email, phone, road, district, complement, post, number_address, city, state } = req.body;
            const user = {
                name,
                email,
                phone,
                road,
                district,
                complement,
                post,
                number_address,
                city,
                state
            };
            try {
                const updatedUser = yield Users_1.default.updateOne({ _id: id }, user);
                if (updatedUser.matchedCount === 0) {
                    return res.status(422).json({ message: 'Nenhuma dado foi atualizado' });
                }
                res.status(200).json(user);
            }
            catch (error) {
                return res.status(500).json(error);
            }
        });
    }
    sendemail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email } = req.body;
            try {
                const codeInitial = Math.round(Math.random() * 12345678);
                let codeFinaly = codeInitial.toString().substring(0, 4);
                const dataCode = {
                    name,
                    email,
                    code: codeFinaly
                };
                const dataEmail = {
                    from: 'Minha Agenda <nao-responder@minhaagenda.com.br>',
                    to: email,
                    subject: `Olá ${name}. Bem vindo ao Minha Agenda`,
                    text: `Informe o código ${codeFinaly} no App para confirmar o seu cadastro.`
                };
                const emailExist = yield ConfirmPass_1.default.findOne({ email: email });
                if (emailExist) {
                    yield ConfirmPass_1.default.deleteOne({ email: email });
                }
                yield ConfirmPass_1.default.create(dataCode);
                transporterMail.sendMail(dataEmail);
                return res.status(201).json({ message: "Código enviado" });
            }
            catch (error) {
                console.log(error.response.data);
                return res.status(422).json(error);
            }
        });
    }
    favoritecompany(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const idUser = req.userId;
            const { id } = req.params;
            try {
                const company = yield Companies_Service_1.default.findById({ _id: id });
                const isFavorite = company === null || company === void 0 ? void 0 : company.id_favorite.findIndex((favorite => {
                    return favorite === idUser;
                }));
                if (isFavorite >= 0) {
                    company === null || company === void 0 ? void 0 : company.id_favorite.splice(isFavorite, 1);
                    yield Companies_Service_1.default.updateOne({ _id: id }, { id_favorite: company === null || company === void 0 ? void 0 : company.id_favorite });
                    return res.status(201).json({ message: `${company === null || company === void 0 ? void 0 : company.company} não favoritada` });
                }
                else {
                    company === null || company === void 0 ? void 0 : company.id_favorite.push(idUser);
                    yield Companies_Service_1.default.updateOne({ _id: id }, { id_favorite: company === null || company === void 0 ? void 0 : company.id_favorite });
                    return res.status(201).json({ message: `${company === null || company === void 0 ? void 0 : company.company} favoritada com sucesso` });
                }
            }
            catch (error) {
                return res.status(422).json(error);
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            if (id !== req.userId) {
                return res.send({ message: "Você não pode apagar os dados de outros usuários" });
            }
            const user = yield Users_1.default.findOne({ _id: id });
            if (!user) {
                res.status(422).json({ message: 'O usuário não foi encontrado!' });
                return;
            }
            try {
                yield Users_1.default.deleteOne({ _id: id });
                res.status(200).json({ message: "Usuário removido com sucesso." });
            }
            catch (error) {
                return res.status(500).json(error);
            }
        });
    }
}
exports.default = new Usercontroller();
