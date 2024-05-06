import { Router } from 'express';
require('dotenv').config();

const router: Router = Router();
export default router;

import {
  APPLY_FOR_JOB,
  DELETE_JOB,
  GET_ALL_JOBS,
  GET_COMPANY_JOB,
  GET_SINGLE_JOB,
  POST_NEW_JOB,
  UPDATE_JOB,
  UPDATE_JOB_APPLICANT,
} from '../controller/job';
import { IS_COMPANY, IS_USER } from '../middlewares';

router.get('/', GET_ALL_JOBS);
router.get('/:id', GET_SINGLE_JOB);

router.post('/', IS_COMPANY, POST_NEW_JOB);
router.put('/:id', IS_COMPANY, UPDATE_JOB);
router.put('/:job_id/:applicant_id', IS_COMPANY, UPDATE_JOB_APPLICANT);
router.delete('/:id', IS_COMPANY, DELETE_JOB);

router.get('/company', IS_COMPANY, GET_COMPANY_JOB);
router.post('/apply/:id', IS_USER, APPLY_FOR_JOB);
