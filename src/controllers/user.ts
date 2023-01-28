import { Request, Response } from "express";
import User from '../models/Users';
import ConfirmPass from "../models/ConfirmPass";
import Companies_Service from "../models/Companies_Service";
const bcrypt = require('bcrypt');
const transporterMail = require("../config/smtp");


class Usercontroller {
    async createuser(req: Request, res: Response) {
        const {
            name,
            email,
            password,
            phone,
            road,
            district,
            complement,
            post,
            number_address,
            city,
            state,
            code } = req.body;

        if (!code) {
            return res.status(422).json({ message: 'Você precisa informar o código recebido por email' });
        }

        const userExists = await User.findOne({ email: email });

        if (userExists) {
            return res.status(422).json({ message: "Por favor, utilize outro e-mail" });
        }

        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);

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
        }

        try {
            const codePass = await ConfirmPass.findOne({ email: email });

            const dataCreated = new Date(codePass?.createdAt!).getMinutes();
            const dataNow = new Date().getMinutes();

            if (codePass?.code !== code) {
                return res.status(422).json({ message: "O código informado está incorreto" });
            }

            if ((dataNow - dataCreated) > 5) {
                return res.status(422).json({ message: "O código expirou. Reenvie para obter um novo código de confirmação" });
            }

            if (codePass?.code === code) {
                const newUser = await User.create(dataUser);
                return res.status(201).json({ message: "Cadastro concluído com sucesso" });
            }
        } catch (error) {
            return res.status(404).json(error);
        }
    }

    async user(req: Request, res: Response) {
        const id = req.userId;

        try {
            const user = await User.findById(id, '-password');

            if (!user) {
                return res.status(422).json({ message: 'O usuário não foi encontrado!' });
            }

            res.status(200).json(user);
        } catch (error) {
            return res.status(422).json(error);
        }
    }
    async update(req: Request, res: Response) {
        const id = req.userId;
        const {
            name,
            email,
            phone,
            road,
            district,
            complement,
            post,
            number_address,
            city,
            state } = req.body;

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
        }

        try {
            const updatedUser = await User.updateOne({ _id: id }, user);

            if (updatedUser.matchedCount === 0) {
                return res.status(422).json({ message: 'Nenhuma dado foi atualizado!' });
            }

            res.status(200).json(user);
        } catch (error) {
            return res.status(500).json(error);
        }
    }
    async sendemail(req: Request, res: Response) {
        const { name, email } = req.body;

        try {
            const codeInitial = Math.round(Math.random() * 12345678);
            let codeFinaly = codeInitial.toString().substring(0, 4);

            const dataCode = {
                name,
                email,
                code: codeFinaly
            }

            const dataEmail = {
                from: 'Minha Agenda <nao-responder@minhaagenda.com.br>',
                to: email,
                subject: `Olá ${name}. Bem vindo ao Minha Agenda`,
                text: `Informe o código ${codeFinaly} no App para confirmar o seu cadastro.`
            };

            const emailExist = await ConfirmPass.findOne({ email: email });

            if (emailExist) {
                await ConfirmPass.deleteOne({ email: email });
            }

            await ConfirmPass.create(dataCode);
            transporterMail.sendMail(dataEmail);

            return res.status(201).json({ message: "Código enviado" });
        } catch (error: any) {
            console.log(error.response.data)
            return res.status(422).json(error);
        }
    }

    async favoritecompany(req: Request, res: Response) {
        const idUser = req.userId;
        const { id } = req.params;

        try {
            const company = await Companies_Service.findById({ _id: id });

            const isFavorite = company?.id_favorite.findIndex((favorite => {
                return favorite === idUser
            }));

            if (isFavorite! >= 0) {
                company?.id_favorite.splice(isFavorite!, 1);
                await Companies_Service.updateOne({ _id: id }, { id_favorite: company?.id_favorite });
                return res.status(201).json({ message: `${company?.name} não favoritada` });

            } else {
                company?.id_favorite.push(idUser);
                await Companies_Service.updateOne({ _id: id }, { id_favorite: company?.id_favorite });
                return res.status(201).json({ message: `${company?.name} favoritada com sucesso` });
            }

        } catch (error: any) {
            return res.status(422).json(error);
        }
    }

    async delete(req: Request, res: Response) {
        const { id } = req.params;

        if (id !== req.userId) {
            return res.send({ message: "Você não pode apagar os dados de outros usuários" });
        }

        const user = await User.findOne({ _id: id });

        if (!user) {
            res.status(422).json({ message: 'O usuário não foi encontrado!' });
            return
        }

        try {
            await User.deleteOne({ _id: id });

            res.status(200).json({ message: "Usuário removido com sucesso." });
        } catch (error) {
            return res.status(500).json(error);
        }
    }
}

export default new Usercontroller();
