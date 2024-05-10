const router = require('express').Router();
import multer from 'multer';
const cloudinary = require('cloudinary').v2;
import { UserSchema } from '../../models';
import streamifier from 'streamifier';

import { NextFunction, Request, Response } from 'express';
import errorHandler from '../../errors';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: false,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });
upload.single('profile_picture');
const options = {
  overwrite: false,
  unique_filename: true,
  folder: 'quickhire',
};
