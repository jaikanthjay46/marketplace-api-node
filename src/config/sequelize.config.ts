import { SequelizeOptions } from 'sequelize-typescript';
import * as models from '../models';
import { config } from './app.config';
import { logger } from './logger.config';

export const sequelizeOptions: SequelizeOptions = {
  host: config.db.host,
  port: config.db.port,
  database: config.db.database,
  username: config.db.username,
  password: config.db.password,
  dialect: 'postgres',
  define: {
    charset: 'utf8',
    collate: 'utf8_general_ci',
    createdAt: false,
    updatedAt: false,
    underscored: true,
  },
  models: Object.values(models),
  benchmark: true,
  logQueryParameters: config.debug,
  logging: (sql, timing) => (config.debug ? logger.debug(`${timing}ms - ${sql}`) : false),
};
