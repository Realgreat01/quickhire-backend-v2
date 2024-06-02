import { CHECK_AUTHENTICATED_USER } from './../middlewares';
import { GET_ALL_JOBS, GET_MATCHED_JOBS, GET_SINGLE_JOB } from '../controller/job';
import { GET_ALL_USERS, GET_SIMILAR_USERS, GET_SINGLE_USER } from '../controller/user/details';
import { Router } from 'express';
require('dotenv').config();

const router: Router = Router();
export default router;

router.get('/jobs/', CHECK_AUTHENTICATED_USER, GET_ALL_JOBS);
router.get('/jobs/matched', CHECK_AUTHENTICATED_USER, GET_MATCHED_JOBS);
router.get('/jobs/:jobId', CHECK_AUTHENTICATED_USER, GET_SINGLE_JOB);
router.get('/users/', GET_ALL_USERS);
router.get('/users/:id', GET_SINGLE_USER);
router.get('/users/:id/similar', GET_SIMILAR_USERS);
