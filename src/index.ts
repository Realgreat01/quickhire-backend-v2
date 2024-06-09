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

const allowedOrigins = [
  'http://www.quickhire.site',
  'https://www.quickhire.site',

  'http://quickhire.site',
  'https://quickhire.site',

  'https://quickhire.vercel.app',
  'https://vercel.app',

  'http://localhost:3000',
  'http://localhost:5173',
  '*',
];

// CORS options
const corsOptions = {
  origin: function (origin: any, callback: Function) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
  // allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  // optionsSuccessStatus: 200, // Some legacy browsers choke on 204
};

// Enable CORS with the above options
app.use(cors(corsOptions));
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
    server.listen(PORT, async () => {
      console.log({
        database: 'connected to database successfully',
        server: 'listening on ' + PORT,
      });
    });
  })
  .catch((e) => console.log(e));

export default app;
