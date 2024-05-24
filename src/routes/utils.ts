import {
  CONVERT_IMAGE_BASE64_URL,
  GET_CITIES,
  GET_COUNTRIES,
  GET_STATES,
  OPERATIONAL_INSIGHTS,
} from '../controller/utils';
import { Router } from 'express';
require('dotenv').config();

const router: Router = Router();
export default router;

router.post('/base64-image', CONVERT_IMAGE_BASE64_URL);
router.get('/insights', OPERATIONAL_INSIGHTS);
router.get('/countries', GET_COUNTRIES);
router.get('/states/:countryId', GET_STATES);
router.get('/cities/:countryId/:stateId', GET_CITIES);
