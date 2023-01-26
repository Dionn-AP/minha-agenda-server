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
                state,
            },
            location: {
                lati,
                long,
            },
            open_schedules
        } = req.body;

        if (!name || !email || !phone
            || !road || !district
            || !number_address || !city
            || !state) {
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
                complement: complement ? complement: "",
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

            if(!companiesOpenSchedules?.length) {
                return res.status(200).json({ message: "Nenhum empresa ou serviço encontrados" });
            }

            return res.status(200).json(companiesOpenSchedules);
        } catch (error: any) {
            return res.status(422).json(error);
        }
    }

    async favoritecompany(req: Request, res: Response) {
        const idUser = req.userId;
        
        try {
            const favorite = Companies_Service.exists({id_favorite: idUser});
            console.log(favorite)

        } catch (error: any) {
            return res.status(422).json(error);
        }
    }
}

export default new Companiescontroller();