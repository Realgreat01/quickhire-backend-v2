import { GET_SINGLE_USER } from '../controller/user/details';
import { Router } from 'express';
require('dotenv').config();

const router: Router = Router();
export default router;

router.get('/user/:id', GET_SINGLE_USER);
