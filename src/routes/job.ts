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
  GET_JOB_APPLICANTS,
  GET_JOB_APPLICANT,
  GET_SINGLE_COMPANY_JOB,
} from '../controller/job';

import { IS_COMPANY, IS_USER } from '../middlewares';

router.get('/jobs/', GET_ALL_JOBS);
router.get('/jobs/:jobId', GET_SINGLE_JOB);

router.post('/company/', IS_COMPANY, POST_NEW_JOB);
router.get('/company/', IS_COMPANY, GET_COMPANY_JOB);
router.get('/company/:jobId', IS_COMPANY, GET_SINGLE_COMPANY_JOB);
router.get('/company/:jobId/applicants', IS_COMPANY, GET_JOB_APPLICANTS);
router.get('/company/:jobId/applicants/:applicantId', IS_COMPANY, GET_JOB_APPLICANT);
router.put('/company/:jobId', IS_COMPANY, UPDATE_JOB);
router.put('/company/:jobId/:applicantId', IS_COMPANY, UPDATE_JOB_APPLICANT);
router.delete('/company/:jobId', IS_COMPANY, DELETE_JOB);

router.post('/user/apply/:jobId', IS_USER, APPLY_FOR_JOB);
router.get('/user/applied', IS_USER, GET_APPLIED_JOBS);
