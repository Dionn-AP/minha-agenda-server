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
class CompaniesController {
    createcompany(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { company, name_owner, email, address: { phone, road, district, complement, post, number_address, city, state }, location: { lati, long, }, service_tags, open_schedules } = req.body;
            if (!company || !name_owner || !email || !phone
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
                company,
                name_owner,
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
    updatecompany(req, res) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { company, name_owner, email, address: { phone, road, district, complement, post, number_address, city, state }, location: { lati, long, }, service_tags, open_schedules } = req.body;
            const currentCompany = yield Companies_Service_1.default.findById({ _id: id });
            if (!currentCompany) {
                return res.status(404).json({ message: "Não foi possível localizar os dados da empresa" });
            }
            if (service_tags.length > 0) {
                currentCompany === null || currentCompany === void 0 ? void 0 : currentCompany.service_tags.push(...service_tags);
            }
            const dataComapny = {
                company: company ? company : currentCompany === null || currentCompany === void 0 ? void 0 : currentCompany.company,
                name_owner: name_owner ? name_owner : currentCompany === null || currentCompany === void 0 ? void 0 : currentCompany.name_owner,
                email: email ? email : currentCompany === null || currentCompany === void 0 ? void 0 : currentCompany.email,
                address: {
                    phone: phone ? phone : (_a = currentCompany === null || currentCompany === void 0 ? void 0 : currentCompany.address) === null || _a === void 0 ? void 0 : _a.phone,
                    road: road ? road : (_b = currentCompany === null || currentCompany === void 0 ? void 0 : currentCompany.address) === null || _b === void 0 ? void 0 : _b.road,
                    district: district ? district : (_c = currentCompany === null || currentCompany === void 0 ? void 0 : currentCompany.address) === null || _c === void 0 ? void 0 : _c.district,
                    complement: complement ? complement : (_d = currentCompany === null || currentCompany === void 0 ? void 0 : currentCompany.address) === null || _d === void 0 ? void 0 : _d.complement,
                    post: post ? post : (_e = currentCompany === null || currentCompany === void 0 ? void 0 : currentCompany.address) === null || _e === void 0 ? void 0 : _e.post,
                    number_address: number_address ? number_address : (_f = currentCompany === null || currentCompany === void 0 ? void 0 : currentCompany.address) === null || _f === void 0 ? void 0 : _f.number_address,
                    city: city ? city : (_g = currentCompany === null || currentCompany === void 0 ? void 0 : currentCompany.address) === null || _g === void 0 ? void 0 : _g.city,
                    state: state ? state : (_h = currentCompany === null || currentCompany === void 0 ? void 0 : currentCompany.address) === null || _h === void 0 ? void 0 : _h.state,
                },
                location: {
                    lati: lati ? lati : (_j = currentCompany === null || currentCompany === void 0 ? void 0 : currentCompany.location) === null || _j === void 0 ? void 0 : _j.lati,
                    long: long ? long : (_k = currentCompany === null || currentCompany === void 0 ? void 0 : currentCompany.location) === null || _k === void 0 ? void 0 : _k.long
                },
                service_tags: currentCompany === null || currentCompany === void 0 ? void 0 : currentCompany.service_tags,
                open_schedules: open_schedules ? open_schedules : currentCompany === null || currentCompany === void 0 ? void 0 : currentCompany.open_schedules
            };
            try {
                const updatedCompany = yield Companies_Service_1.default.updateOne({ _id: id }, dataComapny);
                if (updatedCompany.matchedCount === 0) {
                    return res.status(422).json({ message: 'Nenhuma dado foi atualizado' });
                }
                res.status(200).json(dataComapny);
            }
            catch (error) {
            }
        });
    }
}
exports.default = new CompaniesController();
