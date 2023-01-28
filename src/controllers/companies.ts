import { Request, Response } from "express";
import Companies_Service from "../models/Companies_Service";

class Companiescontroller {
    async createcompany(req: Request, res: Response) {
        const {
            name,
            email,
            address: {
                phone,
                road,
                district,
                complement,
                post,
                number_address,
                city,
                state
            },
            location: {
                lati,
                long,
            },
            service_tags,
            open_schedules
        } = req.body;

        if (!name || !email || !phone
            || !road || !district
            || !number_address || !city
            || !state || !service_tags.length || !open_schedules) {
            return res.status(422).json({ message: 'Você precisa preencher todos os campos obrigatórios' });
        }

        const companyExists = await Companies_Service.findOne({ email: email });

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
        }

        try {
            await Companies_Service.create(dataComapny);

            return res.status(201).json({ message: "Seu cadastro foi concluído com sucesso" });
        } catch (error: any) {
            return res.status(404).json(error);
        }
    }

    async companies(req: Request, res: Response) {
        try {
            const allCompanies = await Companies_Service.find({});

            const companiesOpenSchedules = allCompanies.filter((company => {
                return company.open_schedules === true
            }))

            if (!companiesOpenSchedules?.length) {
                return res.status(200).json({ message: "Nenhum empresa ou serviço encontrados" });
            }

            return res.status(200).json(companiesOpenSchedules);
        } catch (error: any) {
            return res.status(422).json(error);
        }
    }

    async searchcompanies(req: Request, res: Response) {
        const { name } = req.query;
        const rgx = (pattern: any) => new RegExp(`.*${pattern}.*`);
        const searchRgx = rgx(name);
        try {
            const finded = await Companies_Service.find({
                $or: [
                    { name: { $regex: searchRgx, $options: 'i' } },
                    { service_types: { $regex: searchRgx, $options: 'i' } }
                ]
            })
            return res.status(200).json(finded);

        } catch (error: any) {
            return res.status(422).json(error);
        }
    }
}

export default new Companiescontroller();