import express from 'express';
import { createServer } from 'http';
import { Container } from 'typedi';
import initializeApp from './app';
import { config, logger } from './config';
import * as loaders from './loaders';

(async () => {
  // Inject config and logger
  Container.set('config', config);
  Container.set('logger', logger);

  // Create Express application
  const app = express();
  Container.set('app', app);

  // Create HTTP server
  const server = createServer(app);
  Container.set('server', server);

  // Initialize Sequelize instance
  const sequelize = await loaders.initSequelize();
  Container.set('sequelize', sequelize);
  const { options } = sequelize;
  logger.info(
    `Successfully connected to database '${options.database}' at '${options.host}:${options.port}'`,
  );

  // Initialize application
  initializeApp(app);

  // Start server
  await new Promise<void>(resolve => {
    server.listen(config.port, () => {
      logger.info(`App is running on port ${config.port} in ${config.env} mode`);

      resolve();
    });
  });
})().catch(err => {
  logger.error('Application initialization failed.', err);

  process.exit(1);
});
