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
            const { name, email, address: { phone, road, district, complement, post, number_address, city, state }, location: { lati, long, }, service_tags, open_schedules } = req.body;
            if (!name || !email || !phone
                || !road || !district
                || !number_address || !city
                || !state || !service_tags.length || !open_schedules) {
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
                service_tags: service_tags,
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
    searchcompanies(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name } = req.query;
            const rgx = (pattern) => new RegExp(`.*${pattern}.*`);
            const searchRgx = rgx(name);
            try {
                const finded = yield Companies_Service_1.default.find({
                    $or: [
                        { name: { $regex: searchRgx, $options: 'i' } },
                        { service_types: { $regex: searchRgx, $options: 'i' } }
                    ]
                });
                return res.status(200).json(finded);
            }
            catch (error) {
                return res.status(422).json(error);
            }
        });
    }
}
exports.default = new Companiescontroller();
