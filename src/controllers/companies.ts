import { Request, Response } from "express";
import Companies_Service from "../models/Companies_Service";

class CompaniesController {
    async createcompany(req: Request, res: Response) {
        const {
            company,
            name_owner,
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

        if (!company || !name_owner || !email || !phone
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

    async updatecompany(req: Request, res: Response) {
        const { id } = req.params;
        const {
            company,
            name_owner,
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

        const currentCompany = await Companies_Service.findById({ _id: id });

        if (!currentCompany) {
            return res.status(404).json({ message: "Não foi possível localizar os dados da empresa" });
        }

        if(service_tags.length > 0) {
            currentCompany?.service_tags.push(...service_tags);
        }

        const dataComapny = {
            company: company ? company: currentCompany?.company,
            name_owner: name_owner ? name_owner : currentCompany?.name_owner,
            email: email ? email : currentCompany?.email,
            address: {
                phone: phone ? phone : currentCompany?.address?.phone,
                road: road ? road : currentCompany?.address?.road,
                district: district ? district : currentCompany?.address?.district,
                complement: complement ? complement : currentCompany?.address?.complement,
                post: post ? post : currentCompany?.address?.post,
                number_address: number_address ? number_address : currentCompany?.address?.number_address,
                city: city ? city : currentCompany?.address?.city,
                state: state ? state : currentCompany?.address?.state,
            },
            location: {
                lati: lati ? lati : currentCompany?.location?.lati,
                long: long ? long : currentCompany?.location?.long
            },
            service_tags: currentCompany?.service_tags,
            open_schedules: open_schedules ? open_schedules : currentCompany?.open_schedules
        }

        try {
            const updatedCompany = await Companies_Service.updateOne({_id: id}, dataComapny);

            if (updatedCompany.matchedCount === 0) {
                return res.status(422).json({ message: 'Nenhuma dado foi atualizado' });
            }

            res.status(200).json(dataComapny);
        } catch (error) {

        }
    }
}

export default new CompaniesController();