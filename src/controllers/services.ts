import { Request, Response } from "express";
import Companies_Service from "../models/Companies_Service";
import Services from "../models/Services";

class ServicesController {
    async servicescompanies(req: Request, res: Response) {
        const { company_id, service_types } = req.body;

        if (!company_id || !service_types.length) {
            return res.status(400).json({ message: "Você precisa preencher todos os compos obrigatórios" });
        }

        if (service_types.length < 1) {
            return res.status(400).json({ message: "Você precisa informar pelo menos um tipo de serviço" });
        }

        const dataCompany = await Companies_Service.findById({ _id: company_id });

        if (!dataCompany) {
            return res.status(404).json({ message: "Não foi possível localizar os dados da empresa" });
        }

        const dataServices = {
            company_id,
            name_company: dataCompany?.company!,
            service_types: service_types
        }

        try {
            const servicesCreated = await Services.create(dataServices);

            return res.status(201).json({ message: "Serviços cadastrados com sucesso" });

        } catch (error: any) {
            return res.status(422).json(error);
        }
    }

    async addservices(req: Request, res: Response) {
        const { service_types } = req.body;
        const { id } = req.params;

        if (service_types.length < 1) {
            return res.status(400).json({ message: "Você precisa informar pelo menos um tipo de serviço" });
        }

        const services = await Services.findById({ _id: id });

        if (!services) {
            return res.status(404).json({ message: "Não foi possível localizar os dados da empresa" });
        }

        try {
            if (service_types?.length === 1) {
                services.service_types?.push(...service_types);

                await Services.updateOne({ _id: id }, services);

                return res.status(201).json({ message: "Serviço adicionado com sucesso" });
            }

            for (const item of service_types) {
                services.service_types?.push(item);
                console.log(services)
            }

            await Services.updateOne({ _id: id }, services);

            return res.status(201).json({ message: "Serviços adicionados com sucesso" });
        } catch (error: any) {
            return res.status(422).json(error);
        }
    }

    async getservices(req: Request, res: Response) {
        const { id } = req.params;

        if (!id) {
            return res.status(404).json({ message: "Não foi possível localizar os dados da empresa" });
        }

        try {
            const service = await Services.findOne({ company_id: id });

            if (!service) {
                return res.status(404).json({ message: "Não foi possível carregar os dados da empresa" });
            }

            return res.status(200).json(service);

        } catch (error: any) {
            return res.status(422).json(error);
        }
    }

    async updatedservices(req: Request, res: Response) {
        const { id_service } = req.query;
        const { name_service, price, available, id } = req.body;

        const services = await Services.findById({ _id: id_service });

        if (!services) {
            return res.status(404).json({ message: "Não foi possível carregar os dados da empresa" });
        }

        if(!id) {
            return res.status(404).json({ message: "Não foi possível carregar os dados do(s) serviço(s) selecionado(s)" });
        }

        try {

            const indexServiceType = services?.service_types.findIndex((service: { _id: string }) => {
                return service._id.toString() === `${id}`
            });

            if (indexServiceType === -1) {
                return res.status(422).json({ message: 'Nenhuma dado foi atualizado' });
            }

            if (indexServiceType >= 0 && available && !name_service && !price) {
                services?.service_types.splice(indexServiceType, 1, {
                    name_service: services?.service_types[indexServiceType].name_service,
                    price: services?.service_types[indexServiceType].price,
                    available: !services?.service_types[indexServiceType].available,
                    _id: id
                });

                const serviceUpdated = await Services.updateOne({ _id: id_service }, { service_types: services?.service_types });

                if (serviceUpdated.matchedCount === 0) {
                    return res.status(422).json({ message: 'Nenhuma dado foi atualizado' });
                }
            }

            if (indexServiceType >= 0) {
                services?.service_types.splice(indexServiceType, 1, {
                    name_service: name_service ? name_service : services?.service_types[indexServiceType].name_service,
                    price: price ? price : services?.service_types[indexServiceType].price,
                    available: available ? available : services?.service_types[indexServiceType].available,
                    _id: id
                });
            }

            const serviceUpdated = await Services.updateOne({ _id: id_service }, { service_types: services?.service_types });

            if (serviceUpdated.matchedCount === 0) {
                return res.status(422).json({ message: 'Nenhuma dado foi atualizado' });
            }

            return res.status(200).json(services);
        } catch (error) {
            return res.status(422).json(error);
        }
    }
}

export default new ServicesController();