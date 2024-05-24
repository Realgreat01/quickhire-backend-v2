const cloudinary = require('cloudinary').v2;
require('dotenv').config;
import streamifier from 'streamifier';
import multer from 'multer';

const storage = multer.memoryStorage();

export const MULTER_UPLOAD = multer({ storage });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: false,
});

const options = {
  overwrite: false,
  unique_filename: true,
  folder: 'quickhire',
};

export const UPLOAD_TO_CLOUDINARY = async (file: Express.Multer.File) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (result) {
        resolve(result.secure_url);
      } else {
        reject(error);
      }
    });

    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};
