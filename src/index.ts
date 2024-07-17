import http from 'http';
import * as dotenv from 'dotenv';
import ServerResponse from 'responseformatjson';
import createError, { type UnknownError } from 'http-errors';
import MongooseErrorHandler from 'mongoose-express-error-handler';

import path from 'path';
import express, { type Express, Response, Request, NextFunction } from 'express';
import mongoose from 'mongoose';
import { initSocketServer } from './socketIo';
import API_ROUTE from './routes';
import { instrument } from '@socket.io/admin-ui';
import helmet from 'helmet';
import cors from 'cors';

dotenv.config();

const app: Express = express();

const server = http.createServer(app);
export const io = initSocketServer(server);

const PORT = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '../public');
const homeDir = path.join(__dirname, '..');

instrument(io, { auth: false });

const allowedOrigins = '*';

// CORS options
const corsOptions = {
  origin: function (origin: any, callback: Function) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  // optionsSuccessStatus: 200, // Some legacy browsers choke on 204
};

// Enable CORS with the above options
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet({}));
app.use(express.static(publicPath));
app.set('views', path.join(homeDir, 'views'));
app.set('view engine', 'ejs');

// app.use(MongooseErrorHandler);
app.use((req: Request, res: Response, next: NextFunction) => {
  res.success = (data: any, message: string, code = 200) =>
    res.status(code).json(ServerResponse.success(data, message, code));

  res.createError = (code: number, message = 'An error occured', data?: object) =>
    createError(code, message, {
      ...data,
      stack: false,
      success: false,
    });
  res.error = createError;
  next();
});

app.use('/api', API_ROUTE);

app.get('/api', (req: Request, res: Response, next) => {
  /* #swagger.ignore = true */
  return res.success({}, 'App is running ✈️✈️🪐🌟');
});

app.get('/template', (req: Request, res: Response, next) => {
  /* #swagger.ignore = true */

  const data = {
    user: {
      id: '663323c724e1e8bcefdadff5',
      name: 'Samson Ikuomenisan',
      email: 'samson.ikuomenisan@gmail.com',
    },
    job: [
      {
        id: '666212fb4ae9bc1a7afd9291',
        title: 'Lead Engineer ',
        url: 'https://www.quickhire.site/jobs/666212fb4ae9bc1a7afd9291',
        icon: 'https://res.cloudinary.com/dirmjuvyr/image/upload/v1716651066/quickhire/l6mrcx2ggnmvg8qwjlg0.svg',
        company: 'Quickhire Incorporated',
        location: 'Nigeria',
        experienceLevel: 'expert',
        type: 'Full-Time',
        locationType: 'remote',
      },
      {
        id: '66503965924a32162bf4850b',
        title: 'Frontend Developer',
        url: 'https://www.quickhire.site/jobs/66503965924a32162bf4850b',
        icon: 'https://res.cloudinary.com/dirmjuvyr/image/upload/v1716651066/quickhire/l6mrcx2ggnmvg8qwjlg0.svg',
        company: 'Quickhire Incorporated',
        location: 'Nigeria',
        experienceLevel: 'mid',
        type: 'Full-Time',
        locationType: 'remote',
      },
      {
        id: '664285696b9377361d6d0ba2',
        title: 'Fullstack Developer',
        url: 'https://www.quickhire.site/jobs/664285696b9377361d6d0ba2',
        icon: 'https://res.cloudinary.com/dirmjuvyr/image/upload/v1716651066/quickhire/l6mrcx2ggnmvg8qwjlg0.svg',
        company: 'Quickhire Incorporated',
        location: 'Nigeria',
        experienceLevel: 'mid',
        type: 'Full-Time',
        locationType: 'remote',
      },
      {
        id: '663944e78b18e2d536b15161',
        title: 'Frontend Developer',
        url: 'https://www.quickhire.site/jobs/663944e78b18e2d536b15161',
        icon: 'https://res.cloudinary.com/dirmjuvyr/image/upload/v1716651066/quickhire/l6mrcx2ggnmvg8qwjlg0.svg',
        company: 'Quickhire Incorporated',
        location: 'Nigeria',
        experienceLevel: 'senior',
        type: 'Part-Time',
        locationType: 'onsite',
      },
      {
        id: '6675f79f4a1cc4329a0ed7b2',
        title: 'IT Specialist ',
        url: 'https://www.quickhire.site/jobs/6675f79f4a1cc4329a0ed7b2',
        icon: 'https://res.cloudinary.com/dirmjuvyr/image/upload/v1716651066/quickhire/l6mrcx2ggnmvg8qwjlg0.svg',
        company: 'Quickhire Incorporated',
        location: 'Nigeria',
        experienceLevel: 'expert',
        type: 'Full-Time',
        locationType: 'remote',
      },
      {
        id: '664290093a918da2b37fcc6d',
        title: 'Senior Backend Engineer ',
        url: 'https://www.quickhire.site/jobs/664290093a918da2b37fcc6d',
        icon: 'https://res.cloudinary.com/dirmjuvyr/image/upload/v1716651066/quickhire/l6mrcx2ggnmvg8qwjlg0.svg',
        company: 'Quickhire Incorporated',
        location: 'Nigeria',
        experienceLevel: 'senior',
        type: 'Full-Time',
        locationType: 'hybrid',
      },
      {
        id: '664360fd02eb7fe6e3ba17ef',
        title: 'DevRel Engineer',
        url: 'https://www.quickhire.site/jobs/664360fd02eb7fe6e3ba17ef',
        icon: 'https://res.cloudinary.com/dirmjuvyr/image/upload/v1716651066/quickhire/l6mrcx2ggnmvg8qwjlg0.svg',
        company: 'Quickhire Incorporated',
        location: 'Nigeria',
        experienceLevel: 'senior',
        type: 'Full-Time',
        locationType: 'remote',
      },
      {
        id: '663944c88b18e2d536b1515a',
        title: 'Fullstack Engineer',
        url: 'https://www.quickhire.site/jobs/663944c88b18e2d536b1515a',
        icon: 'https://res.cloudinary.com/dirmjuvyr/image/upload/v1716651066/quickhire/l6mrcx2ggnmvg8qwjlg0.svg',
        company: 'Quickhire Incorporated',
        location: 'Nigeria',
        experienceLevel: 'senior',
        type: 'Part-Time',
        locationType: 'hybrid',
      },
      {
        id: '66394230dd6ce6a01290ef54',
        title: 'DevOps Engineer',
        url: 'https://www.quickhire.site/jobs/66394230dd6ce6a01290ef54',
        icon: 'https://res.cloudinary.com/dirmjuvyr/image/upload/v1716651066/quickhire/l6mrcx2ggnmvg8qwjlg0.svg',
        company: 'Quickhire Incorporated',
        location: 'Nigeria',
        experienceLevel: 'senior',
        type: 'Part-Time',
        locationType: 'remote',
      },
    ],
  };
  return res.render('templates/top-matched-jobs', {
    jobs: data.job,
    user: {
      id: '663323c724e1e8bcefdadff5',
      name: 'Samson Ikuomenisan',
      email: 'samson.ikuomenisan@gmail.com',
    },
  });
});

app.use('', (req: Request, res: Response, next: NextFunction) => {
  return next(
    res.createError(404, 'PATH DOES NOT EXIST', { path: req.path, params: req.params, method: req.method }),
  );
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500);
  const { message, status, ...otherDetails } = err;
  res.json({
    status: err.status,
    code: status,
    message: err.message,
    data: otherDetails,
  });
});

mongoose.set('strictQuery', true);

const mongooseInstance = mongoose.connect(process.env.MONGO_URI || '');
mongooseInstance
  .then(() => {
    app.listen(PORT, async () => {
      console.log({
        database: 'connected to database successfully',
        server: 'listening on ' + PORT,
      });
    });
  })
  .catch((e) => console.log(e));

export default app;
