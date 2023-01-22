import { Request, Response } from "express";
import User from '../models/Users';
const bcrypt =  require('bcrypt');

class Passwords {
    async getPassword(req: Request, res: Response) {
        const { password } = req.body;
        const id = req.userId;

        if (!password) {
            return res.status(400).json({ message: 'Informe sua senha atual' });
        }

        try {
            const user = await User.findById(id);

            const correctPassword = await bcrypt.compare(password, user?.password!);

            if (!correctPassword) {
                return res.status(404).json({ message: "Senha incorreta" });
            }

            res.status(200).json({message: "Senha correta"});
        } catch (error) {
            return res.status(400).json(error);
        }
    }

    async changePassword(req: Request, res: Response) {
        const { password, confirm_password } = req.body;
        const id = req.userId;

        if (!password || !confirm_password) {
            return res.status(404).json({ message: 'Você precisa informar a nova senha' });
        }

        if (!password || confirm_password) {
            return res.status(404).json({ message: 'Você precisa confirmar a nova senha' });
        }

        if (password !== confirm_password) {
            return res.status(404).json({ message: 'As senhas precisam ser iguais' });
        }

        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);

        try {
            const updatedPassword = await User.updateOne({ _id: id }, {$set: {password: passwordHash}});

            if(!updatedPassword) { return res.status(404).json({ message: 'não foi possível atualizar sua senha' }); }
            
            res.status(200).json({message: "Senha alterada com sucesso"});
        } catch (error) {
            return res.status(400).json(error);
        }
    }
}

export default new Passwords();