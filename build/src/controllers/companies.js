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
const Companies_Service_1 = __importDefault(require("../models/Companies_Service"));
class Companiescontroller {
    createcompany(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, address: { phone, road, district, complement, post, number_address, city, state, }, location: { lati, long, }, open_schedules } = req.body;
            if (!name || !email || !phone
                || !road || !district
                || !number_address || !city
                || !state) {
                return res.status(422).json({ message: 'Você precisa preencher todos os campos obrigatórios' });
            }
            const companyExists = yield Companies_Service_1.default.findOne({ email: email });
            if (companyExists) {
                return res.status(422).json({ message: "Essa empressa ou serviço ja estão cadastrados" });
            }
            const dataComapny = {
                name,
                email,
                address: {
                    phone,
                    road,
                    district,
                    complement: complement ? complement : "",
                    post: post ? post : "",
                    number_address,
                    city,
                    state,
                },
                location: {
                    lati: lati ? lati : "",
                    long: long ? long : ""
                },
                open_schedules,
                id_favorite: []
            };
            try {
                yield Companies_Service_1.default.create(dataComapny);
                return res.status(201).json({ message: "Seu cadastro foi concluído com sucesso" });
            }
            catch (error) {
                return res.status(404).json(error);
            }
        });
    }
    companies(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allCompanies = yield Companies_Service_1.default.find({});
                const companiesOpenSchedules = allCompanies.filter((company => {
                    return company.open_schedules === true;
                }));
                if (!(companiesOpenSchedules === null || companiesOpenSchedules === void 0 ? void 0 : companiesOpenSchedules.length)) {
                    return res.status(200).json({ message: "Nenhum empresa ou serviço encontrados" });
                }
                return res.status(200).json(companiesOpenSchedules);
            }
            catch (error) {
                return res.status(422).json(error);
            }
        });
    }
    favoritecompany(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const idUser = req.userId;
            try {
                const favorite = Companies_Service_1.default.exists({ id_favorite: idUser });
                console.log(favorite);
            }
            catch (error) {
                return res.status(422).json(error);
            }
        });
    }
}
exports.default = new Companiescontroller();
