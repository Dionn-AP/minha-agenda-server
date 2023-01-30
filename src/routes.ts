import { Router } from "express";

import Usercontroller from './controllers/user';
import Passwords from "./controllers/passwords";
import Login from "./controllers/login";
import CompaniesController from './controllers/companies';
import ServicesController from './controllers/services';
import authMiddleware from "./middleware/middlewareLogin";

const router = Router();

//user
router.post('/sendmail', Usercontroller.sendemail);
router.post('/user', Usercontroller.createuser);
router.post('/login', Login.authenticate);

//companies
router.get('/companies', CompaniesController.companies);
router.get('/search-companies', CompaniesController.searchcompanies);
router.post('/company', CompaniesController.createcompany);
router.patch('/company/:id', CompaniesController.updatecompany);

//sercives
router.get('/services/:id', ServicesController.getservices);
router.post('/services', ServicesController.servicescompanies);
router.patch('/add-services/:id', ServicesController.addservices);

//routes authenticated
router.get('/user', authMiddleware, Usercontroller.user);
router.post('/user/discover-password', authMiddleware, Passwords.getPassword);
router.patch('/user', authMiddleware, Usercontroller.update);
router.patch('/user/change-password', authMiddleware, Passwords.changePassword);
router.patch('/companies/favorites/:id', authMiddleware, Usercontroller.favoritecompany);
router.delete('/user/:id', authMiddleware, Usercontroller.delete);


export default router;
