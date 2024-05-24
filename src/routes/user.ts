import { Router } from 'express';
require('dotenv').config();
const router: Router = Router();

import { MULTER_UPLOAD } from '../config/cloudinary';
export default router;

import {
  GET_SINGLE_USER,
  GET_USER_DETAILS,
  UPDATE_USER_DETAILS,
  UPLOAD_PROFILE_PICTURE,
} from '../controller/user/details';
import { GET_USER_SKILLS, UPDATE_USER_SKILLS } from '../controller/user/skills';

import {
  GET_EDUCATION,
  ADD_EDUCATION,
  UPDATE_EDUCATION,
  DELETE_EDUCATION,
  GET_SINGLE_EDUCATION,
} from '../controller/user/education';

import {
  ADD_EXPERIENCE,
  DELETE_EXPERIENCE,
  GET_EXPERIENCE,
  GET_SINGLE_EXPERIENCE,
  UPDATE_EXPERIENCE,
} from '../controller/user/experience';

import {
  ADD_PROJECT,
  DELETE_PROJECT,
  GET_PROJECT,
  GET_SINGLE_PROJECT,
  UPDATE_PROJECT,
} from '../controller/user/projects';

router.get('/', GET_USER_DETAILS);
router.get('/user/:id', GET_SINGLE_USER);
router.put('/', UPDATE_USER_DETAILS);

router.get('/skills', GET_USER_SKILLS);
router.put('/skills', UPDATE_USER_SKILLS);
router.post('/skills', UPDATE_USER_SKILLS);

router.get('/education', GET_EDUCATION);
router.get('/education/:id', GET_SINGLE_EDUCATION);
router.post('/education', ADD_EDUCATION);
router.put('/education/:id', UPDATE_EDUCATION);
router.delete('/education/:id', DELETE_EDUCATION);

router.get('/experience', GET_EXPERIENCE);
router.get('/experience/:id', GET_SINGLE_EXPERIENCE);
router.post('/experience', ADD_EXPERIENCE);
router.put('/experience/:id', UPDATE_EXPERIENCE);
router.delete('/experience/:id', DELETE_EXPERIENCE);

router.get('/project', GET_PROJECT);
router.get('/project/:id', GET_SINGLE_PROJECT);
router.post('/project', ADD_PROJECT);
router.put('/project/:id', UPDATE_PROJECT);
router.delete('/project/:id', DELETE_PROJECT);

router.put('/update/profile-picture', MULTER_UPLOAD.single('profile_picture'), UPLOAD_PROFILE_PICTURE);
