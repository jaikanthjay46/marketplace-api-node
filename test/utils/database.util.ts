import { exec } from 'child_process';
import { ModelType, Sequelize, Transaction } from 'sequelize';
import { Container } from 'typedi';
import { sequelizeOptions } from '../../src/config';

/**
 * Truncates the table associated to `model`.
 */
export const truncateModel = async (model: ModelType, transaction?: Transaction): Promise<void> => {
  await model.destroy({ where: {}, force: true, transaction });
};

/**
 * Truncates all the tables from the database.
 */
export const cleanDatabase = async (): Promise<void> => {
  const sequelize = Container.get<Sequelize>('sequelize');

  return sequelize.transaction(async transaction => {
    await sequelize.query("SET session_replication_role = 'replica';", { transaction });

    await Promise.all(
      Object.entries(sequelize.models).map(([, model]) => truncateModel(model, transaction)),
    );
    await sequelize.query("SET session_replication_role = 'origin';", { transaction });
  });
};

/**
 * Initializes a test database by recreating it and running all migrations and seeders.
 */
export const initializeTestDatabase = async () => {
  const sequelize = new Sequelize(sequelizeOptions);

  // Recreate database
  await sequelize.query(`DROP DATABASE IF EXISTS ${sequelize.config.database};`);
  await sequelize.query(`CREATE DATABASE ${sequelize.config.database};`);

  // Run migrations
  await new Promise<void>((resolve, reject) => {
    const migrate = exec('sequelize db:migrate', { env: process.env }, err =>
      err ? reject(err) : resolve(),
    );

    migrate.stdout?.pipe(process.stdout);
    migrate.stderr?.pipe(process.stderr);
  });

  // Run seeders
  await new Promise<void>((resolve, reject) => {
    const migrate = exec('sequelize db:seed:all', { env: process.env }, err =>
      err ? reject(err) : resolve(),
    );

    migrate.stdout?.pipe(process.stdout);
    migrate.stderr?.pipe(process.stderr);
  });
};
