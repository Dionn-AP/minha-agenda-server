import { Router } from "express";

import Usercontroller from './controllers/user';
import Passwords from "./controllers/passwords";
import Login from "./controllers/login";
import Companiescontroller from './controllers/companies';
import authMiddleware from "./middleware/middlewareLogin";

const router = Router();

//user
router.post('/sendmail', Usercontroller.sendemail);
router.post('/user', Usercontroller.createuser);
router.post('/login', Login.authenticate);

//companies
router.post('/company', Companiescontroller.createcompany);
router.get('/companies', Companiescontroller.companies);
router.get('/search-companies', Companiescontroller.searchcompanies);

//authenticated
router.get('/user', authMiddleware, Usercontroller.user);
router.patch('/user', authMiddleware, Usercontroller.update);
router.delete('/user/:id', authMiddleware, Usercontroller.delete);
router.post('/user/discover-password', authMiddleware, Passwords.getPassword);
router.patch('/user/change-password', authMiddleware, Passwords.changePassword);
router.patch('/companies/favorites/:id', authMiddleware, Usercontroller.favoritecompany);


export default router;
