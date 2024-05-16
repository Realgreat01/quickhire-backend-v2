import { CONVERT_IMAGE_BASE64_URL, OPERATIONAL_INSIGHTS } from '../controller/utils';
import { Router } from 'express';
require('dotenv').config();

const router: Router = Router();
export default router;

router.post('/base64-image', CONVERT_IMAGE_BASE64_URL);
router.get('/insights', OPERATIONAL_INSIGHTS);
