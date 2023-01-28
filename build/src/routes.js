"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = __importDefault(require("./controllers/user"));
const passwords_1 = __importDefault(require("./controllers/passwords"));
const login_1 = __importDefault(require("./controllers/login"));
const companies_1 = __importDefault(require("./controllers/companies"));
const middlewareLogin_1 = __importDefault(require("./middleware/middlewareLogin"));
const router = (0, express_1.Router)();
//user
router.post('/sendmail', user_1.default.sendemail);
router.post('/user', user_1.default.createuser);
router.post('/login', login_1.default.authenticate);
//companies
router.post('/company', companies_1.default.createcompany);
router.get('/companies', companies_1.default.companies);
router.get('/search-companies', companies_1.default.searchcompanies);
//authenticated
router.get('/user', middlewareLogin_1.default, user_1.default.user);
router.patch('/user', middlewareLogin_1.default, user_1.default.update);
router.delete('/user/:id', middlewareLogin_1.default, user_1.default.delete);
router.post('/user/discover-password', middlewareLogin_1.default, passwords_1.default.getPassword);
router.patch('/user/change-password', middlewareLogin_1.default, passwords_1.default.changePassword);
router.patch('/companies/favorites/:id', middlewareLogin_1.default, user_1.default.favoritecompany);
exports.default = router;
