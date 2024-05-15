import { GET_ALL_JOBS, GET_SINGLE_JOB } from '../controller/job';
import { GET_ALL_USERS, GET_SINGLE_USER } from '../controller/user/details';
import { Router } from 'express';
require('dotenv').config();

const router: Router = Router();
export default router;

router.get('/jobs/', GET_ALL_JOBS);
router.get('/jobs/:jobId', GET_SINGLE_JOB);
router.get('/users/', GET_ALL_USERS);
router.get('/users/:id', GET_SINGLE_USER);
