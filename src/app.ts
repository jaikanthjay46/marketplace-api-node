import 'reflect-metadata';
import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import express, { Application } from 'express';
import rateLimit from 'express-rate-limit';
import statusMonitor from 'express-status-monitor';
import helmet from 'helmet';
import { NotFound, TooManyRequests } from 'http-errors';
import { join } from 'path';
import favicon from 'serve-favicon';
import { Container } from 'typedi';
import { Config } from './config';
import router from './controllers';
import {
  celebrateErrorHandler,
  errorHandler,
  jwtErrorHandler,
  sequelizeErrorHandler,
} from './middlewares';

/**
 * Method used to setup middlewares and routing for the `app` instance.
 */
export default function initializeApp(app: Application) {
  const config = Container.get<Config>('config');

  app.enable('trust proxy');
  app.use(bodyParser.json());
  app.use(compression());
  app.use(cors());
  app.use(favicon(join(config.publicPath, 'favicon.ico')));
  // app.use(helmet({ contentSecurityPolicy: false })); // TODO: Enable CSP in production

  // Rate limiting configuration
  app.use(
    rateLimit({
      windowMs: 10 * 60 * 1000, // 10 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: 'Too many requests, please try again later.',
      statusCode: new TooManyRequests().statusCode,
      skip: () => !(config.env === 'production'),
    }),
  );

  // Status monitoring configuration
  app.use(
    statusMonitor({
      path: '/status',
      title: 'Marketplace REST API | Monitoring',
    }),
  );

  // API documentation
  app.use('/doc', express.static(join(config.publicPath, '/doc')));

  // Public assets
  app.use('/public', express.static(config.publicPath));

  // Routing configuration
  app.use('/api', router);

  // 404 error handling
  app.use((req, res, next) => {
    const { baseUrl, url, method } = req;

    next(new NotFound(`The route '${method} ${baseUrl}${url}' doesn't exist.`));
  });

  // Error handling
  app.use(jwtErrorHandler());
  app.use(celebrateErrorHandler());
  app.use(sequelizeErrorHandler());
  app.use(errorHandler());
}
