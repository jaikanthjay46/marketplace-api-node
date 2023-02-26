import express from 'express';
import { createServer, Server } from 'http';
import request, { SuperAgentTest } from 'supertest';
import { Container } from 'typedi';
import initializeApp from '../src/app';
import { config, logger } from '../src/config';
import * as loaders from '../src/loaders';

let server: Server;

export let agent: SuperAgentTest;

beforeAll(async () => {
  // Inject config and logger
  Container.set('config', config);
  Container.set('logger', logger);

  // Create express application
  const app = express();
  Container.set('app', app);

  // Create HTTP server
  server = createServer(app);
  Container.set('server', server);

  // Initialize Sequelize instance
  const sequelize = await loaders.initSequelize();
  Container.set('sequelize', sequelize);

  // Initialize application
  initializeApp(app);

  // Start server
  await new Promise<void>(resolve => {
    server.listen(config.port, () => {
      agent = request.agent(app);

      resolve();
    });
  });
});

afterAll(async () => {
  // Close server connection
  await new Promise<void>((resolve, reject) => {
    server.close(err => {
      if (err) reject(err);
      else resolve();
    });
  });
});
