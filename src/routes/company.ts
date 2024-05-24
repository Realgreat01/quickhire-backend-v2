import {
  GET_ALL_COMPANY,
  GET_CURRENT_COMPANY,
  GET_SINGLE_COMPANY,
  UPDATE_COMPANY_DETAILS,
  UPLOAD_COMPANY_COVER_IMAGE,
  UPLOAD_COMPANY_LOGO,
} from '../controller/company';
import { Router } from 'express';
import { MULTER_UPLOAD } from '../config/cloudinary';

const router: Router = Router();
export default router;

router.get('/', GET_CURRENT_COMPANY);
router.get('/companies/all', GET_ALL_COMPANY);
router.get('/:id', GET_SINGLE_COMPANY);
router.put('/', UPDATE_COMPANY_DETAILS);
router.put('/cover-image', MULTER_UPLOAD.single('cover-image'), UPLOAD_COMPANY_COVER_IMAGE);
router.put('/logo', MULTER_UPLOAD.single('logo'), UPLOAD_COMPANY_LOGO);
