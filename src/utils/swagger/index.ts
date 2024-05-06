import swaggerAutogen from 'swagger-autogen';
import * as dotenv from 'dotenv';
dotenv.config();
const swaggerConfig = {
  info: {
    version: '1.0.0',
    title: 'QUICKHIRE API',
    description: 'API Documentation for QUICKHIRE API. The world best hiring solution for developers!',
    contact: { name: 'The Best Developer' },
  },

  host: process.env.PORT || 'http://localhost:3000',
  basePath: '/',
  schemes: ['http', 'https'],
  consumes: ['application/json'],
  produces: ['application/json'],
  customSiteTitle: 'QUICKHIRE Documentation',
  securityDefinitions: {
    bearerAuth: {
      type: 'http' || 'https',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
  },
};

const outputFile = './src/swagger-output.json';
const endpointsFiles = ['./src/index.ts'];

export default swaggerAutogen({ openapi: '3.0.0', autoHeaders: false })(
  outputFile,
  endpointsFiles,
  swaggerConfig,
);
