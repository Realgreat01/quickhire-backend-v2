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
  GET_SIMILAR_JOBS,
  GET_JOB_RECOMMENDATIONS,
  UPDATE_JOB_APPLICATION_STATUS,
  UPDATE_BULK_JOB_APPLICANTS,
  BOOKMARK_JOB,
  GET_BOOKMARK_JOBS,
  DELETE_BOOKMARK_JOB,
  GET_APPLICANT_RECOMMENDATIONS,
} from '../controller/job';

import { IS_COMPANY, IS_USER } from '../middlewares';

router.post('/company/', IS_COMPANY, POST_NEW_JOB);
router.get('/company/', IS_COMPANY, GET_COMPANY_JOB);

router.get('/company/:jobId', IS_COMPANY, GET_SINGLE_COMPANY_JOB);
router.put('/company/:jobId', IS_COMPANY, UPDATE_JOB);
router.put('/company/:jobId/update-status', IS_COMPANY, UPDATE_JOB_APPLICATION_STATUS);
router.delete('/company/:jobId', IS_COMPANY, DELETE_JOB);

router.get('/company/:jobId/applicants', IS_COMPANY, GET_JOB_APPLICANTS);
router.get('/company/:jobId/applicants/recommendations', IS_COMPANY, GET_APPLICANT_RECOMMENDATIONS);
router.put('/company/:jobId/applicants', IS_COMPANY, UPDATE_BULK_JOB_APPLICANTS);
router.get('/company/:jobId/applicants/:applicantId', IS_COMPANY, GET_JOB_APPLICANT);
router.put('/company/:jobId/applicants/:applicantId', IS_COMPANY, UPDATE_JOB_APPLICANT);

router.post('/user/apply/:jobId', IS_USER, APPLY_FOR_JOB);
router.get('/user/bookmark', IS_USER, GET_BOOKMARK_JOBS);
router.post('/user/bookmark/:jobId', IS_USER, BOOKMARK_JOB);
router.delete('/user/bookmark/:jobId', IS_USER, DELETE_BOOKMARK_JOB);
router.get('/user/applied', IS_USER, GET_APPLIED_JOBS);
router.get('/user/recommendations/', IS_USER, GET_JOB_RECOMMENDATIONS);

router.get('/similar/:id', GET_SIMILAR_JOBS);
