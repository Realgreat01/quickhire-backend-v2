import {
  GET_ALL_COMPANY,
  GET_CURRENT_COMPANY,
  GET_SINGLE_COMPANY,
  UPDATE_COMPANY_DETAILS,
} from '../controller/company';
import { Router } from 'express';
require('dotenv').config();

const router: Router = Router();
export default router;

router.get('/', GET_CURRENT_COMPANY);
router.get('/companies/all', GET_ALL_COMPANY);
router.get('/:id', GET_SINGLE_COMPANY);
router.put('/', UPDATE_COMPANY_DETAILS);
