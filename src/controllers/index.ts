import Router from 'express-promise-router';
import morgan from 'morgan';
import { Container } from 'typedi';
import { Logger } from 'winston';
import authController from './auth.controller';
import healthController from './health.controller';

const router = Router();

/**
 * HTTP request logging configuration
 */
router.use(
  morgan('dev', {
    stream: {
      write: message => {
        const logger = Container.get<Logger>('logger');

        logger.info(message.trim());
      },
    },
  }),
);

/**
 * API routes
 */
router.use('/auth', authController);
router.use('/health', healthController);

export default router;
