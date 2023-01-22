import { Router } from "express";

import Usercontroller from './controllers/user';
import Passwords from "./controllers/passwords";
import Login from "./controllers/login";
import authMiddleware from "./middleware/middlewareLogin";

const router = Router();

router.post('/sendmail', Usercontroller.sendemail);
router.post('/user', Usercontroller.createuser);
router.post('/login', Login.authenticate);
router.get('/user', authMiddleware, Usercontroller.user);
router.patch('/user', authMiddleware, Usercontroller.update);
router.delete('/user/:id', authMiddleware, Usercontroller.delete);
router.post('/user/discover-password', authMiddleware, Passwords.getPassword);
router.patch('/user/change-password', authMiddleware, Passwords.changePassword);


export default router;
