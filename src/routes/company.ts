import { GET_ALL_COMPANY, GET_CURRENT_COMPANY, GET_SINGLE_COMPANY } from '../controller/company';
import { Router } from 'express';
require('dotenv').config();

const router: Router = Router();
export default router;

router.get('/', GET_CURRENT_COMPANY);
router.get('/all', GET_ALL_COMPANY);
router.get('/:id', GET_SINGLE_COMPANY);
