import { GET_ALL_USERS, GET_SINGLE_USER } from '../controller/user/details';
import { Router } from 'express';
require('dotenv').config();

const router: Router = Router();
export default router;

router.get('/users/', GET_ALL_USERS);
router.get('/users/:id', GET_SINGLE_USER);
