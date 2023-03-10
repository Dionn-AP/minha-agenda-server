"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require('jsonwebtoken');
function authMiddleware(req, res, next) {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({ message: "Usuário não autenticado." });
    }
    const token = authorization.replace('Bearer', '').trim();
    try {
        const secret = process.env.SECRET_KEY;
        const data = jwt.verify(token, `${secret}`);
        const { id } = data;
        req.userId = id;
        return next();
    }
    catch (error) {
        return res.status(500).json({ error: error });
    }
}
exports.default = authMiddleware;
