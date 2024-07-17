import express, { type Express } from 'express';
import { AUTHENTICATE_USER, IS_COMPANY, IS_USER } from '../middlewares';
import swaggerUI from 'swagger-ui-express';
import swaggerOutputFile from '../swagger-output.json';

import AUTH_ROUTE from './auth';
import USER_ROUTE from './user';
import JOB_ROUTE from './job';
import COMPANY_ROUTE from './company';
import PUBLIC_ROUTE from './public';
import UTILS_ROUTE from './utils';
import { SEND_JOB_RECOMMENDATIONS } from '../utils/agenda/send-job-recommendation';

const app: Express = express();

app.use('/auth', /*  #swagger.tags = ['Auth'] */ AUTH_ROUTE);
app.use('/user', /*  #swagger.tags = ['User'] */ AUTHENTICATE_USER, IS_USER, USER_ROUTE);
app.use('/company', /*  #swagger.tags = ['Company'] */ AUTHENTICATE_USER, IS_COMPANY, COMPANY_ROUTE);
app.use('/job', /*  #swagger.tags = ['Job'] */ AUTHENTICATE_USER, JOB_ROUTE);
app.use('/utils', /*  #swagger.tags = ['Utils'] */ UTILS_ROUTE);
app.use('/public', /*  #swagger.tags = ['Public'] */ PUBLIC_ROUTE);
app.use(
  '/test',
  /*  #swagger.tags = ['Public'] */ async (req, res, next) => {
    return res.success(await SEND_JOB_RECOMMENDATIONS());
  },
);

app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerOutputFile));
export default app;
