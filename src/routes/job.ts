import { Router } from 'express';
require('dotenv').config();

const router: Router = Router();
export default router;

import {
  APPLY_FOR_JOB,
  DELETE_JOB,
  GET_ALL_JOBS,
  GET_APPLIED_JOBS,
  GET_COMPANY_JOB,
  GET_SINGLE_JOB,
  POST_NEW_JOB,
  UPDATE_JOB,
  UPDATE_JOB_APPLICANT,
} from '../controller/job';
import { IS_COMPANY, IS_USER } from '../middlewares';

router.get('/', GET_ALL_JOBS);
router.get('/:id', GET_SINGLE_JOB);

router.post('/company/', IS_COMPANY, POST_NEW_JOB);
router.get('/company/', IS_COMPANY, GET_COMPANY_JOB);
router.put('/company/:id', IS_COMPANY, UPDATE_JOB);
router.put('/company/:job_id/:applicant_id', IS_COMPANY, UPDATE_JOB_APPLICANT);
router.delete('/company/:id', IS_COMPANY, DELETE_JOB);

router.post('/user/apply/:id', IS_USER, APPLY_FOR_JOB);
router.get('/user/applied', IS_USER, GET_APPLIED_JOBS);
