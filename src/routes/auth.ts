import express, { Router } from 'express';
import { LOGIN_USER, REGISTER_USER } from '../controller/auth/users-auth';
import { LOGIN_COMPANY, REGISTER_COMPANY } from '../controller/auth/company-auth';
require('dotenv').config();

const router: Router = Router();

router.post('/register', REGISTER_USER);
router.post('/login', LOGIN_USER);

router.post('/register/company', REGISTER_COMPANY);
router.post('/login/company', LOGIN_COMPANY);

export default router;
