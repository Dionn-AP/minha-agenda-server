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
const Services_1 = __importDefault(require("../models/Services"));
class ServicesController {
    servicescompanies(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { company_id, service_types } = req.body;
            if (!company_id || !service_types.length) {
                return res.status(400).json({ message: "Você precisa preencher todos os compos obrigatórios" });
            }
            if (service_types.length < 1) {
                return res.status(400).json({ message: "Você precisa informar pelo menos um tipo de serviço" });
            }
            const dataCompany = yield Companies_Service_1.default.findById({ _id: company_id });
            if (!dataCompany) {
                return res.status(404).json({ message: "Não foi possível localizar os dados da empresa" });
            }
            const dataServices = {
                company_id,
                name_company: dataCompany === null || dataCompany === void 0 ? void 0 : dataCompany.company,
                service_types: service_types
            };
            try {
                const servicesCreated = yield Services_1.default.create(dataServices);
                return res.status(201).json({ message: "Serviços cadastrados com sucesso" });
            }
            catch (error) {
                return res.status(422).json(error);
            }
        });
    }
    addservices(req, res) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const { service_types } = req.body;
            const { id } = req.params;
            if (service_types.length < 1) {
                return res.status(400).json({ message: "Você precisa informar pelo menos um tipo de serviço" });
            }
            const services = yield Services_1.default.findById({ _id: id });
            if (!services) {
                return res.status(404).json({ message: "Não foi possível localizar os dados da empresa" });
            }
            try {
                if ((service_types === null || service_types === void 0 ? void 0 : service_types.length) === 1) {
                    (_a = services.service_types) === null || _a === void 0 ? void 0 : _a.push(...service_types);
                    yield Services_1.default.updateOne({ _id: id }, services);
                    return res.status(201).json({ message: "Serviço adicionado com sucesso" });
                }
                for (const item of service_types) {
                    (_b = services.service_types) === null || _b === void 0 ? void 0 : _b.push(item);
                    console.log(services);
                }
                yield Services_1.default.updateOne({ _id: id }, services);
                return res.status(201).json({ message: "Serviços adicionados com sucesso" });
            }
            catch (error) {
                return res.status(422).json(error);
            }
        });
    }
    getservices(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            if (!id) {
                return res.status(404).json({ message: "Não foi possível localizar os dados da empresa" });
            }
            try {
                const service = yield Services_1.default.findOne({ company_id: id });
                if (!service) {
                    return res.status(404).json({ message: "Não foi possível carregar os dados da empresa" });
                }
                return res.status(200).json(service);
            }
            catch (error) {
                return res.status(422).json(error);
            }
        });
    }
    updatedservices(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_service } = req.query;
            const { name_service, price, available, id } = req.body;
            const services = yield Services_1.default.findById({ _id: id_service });
            if (!services) {
                return res.status(404).json({ message: "Não foi possível carregar os dados da empresa" });
            }
            if (!id) {
                return res.status(404).json({ message: "Não foi possível carregar os dados do(s) serviço(s) selecionado(s)" });
            }
            try {
                const indexServiceType = services === null || services === void 0 ? void 0 : services.service_types.findIndex((service) => {
                    return service._id.toString() === `${id}`;
                });
                if (indexServiceType === -1) {
                    return res.status(422).json({ message: 'Nenhuma dado foi atualizado' });
                }
                if (indexServiceType >= 0 && available && !name_service && !price) {
                    services === null || services === void 0 ? void 0 : services.service_types.splice(indexServiceType, 1, {
                        name_service: services === null || services === void 0 ? void 0 : services.service_types[indexServiceType].name_service,
                        price: services === null || services === void 0 ? void 0 : services.service_types[indexServiceType].price,
                        available: !(services === null || services === void 0 ? void 0 : services.service_types[indexServiceType].available),
                        _id: id
                    });
                    const serviceUpdated = yield Services_1.default.updateOne({ _id: id_service }, { service_types: services === null || services === void 0 ? void 0 : services.service_types });
                    if (serviceUpdated.matchedCount === 0) {
                        return res.status(422).json({ message: 'Nenhuma dado foi atualizado' });
                    }
                }
                if (indexServiceType >= 0) {
                    services === null || services === void 0 ? void 0 : services.service_types.splice(indexServiceType, 1, {
                        name_service: name_service ? name_service : services === null || services === void 0 ? void 0 : services.service_types[indexServiceType].name_service,
                        price: price ? price : services === null || services === void 0 ? void 0 : services.service_types[indexServiceType].price,
                        available: available ? available : services === null || services === void 0 ? void 0 : services.service_types[indexServiceType].available,
                        _id: id
                    });
                }
                const serviceUpdated = yield Services_1.default.updateOne({ _id: id_service }, { service_types: services === null || services === void 0 ? void 0 : services.service_types });
                if (serviceUpdated.matchedCount === 0) {
                    return res.status(422).json({ message: 'Nenhuma dado foi atualizado' });
                }
                return res.status(200).json(services);
            }
            catch (error) {
                return res.status(422).json(error);
            }
        });
    }
}
exports.default = new ServicesController();
