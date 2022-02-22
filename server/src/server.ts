/**
 * @author: abhijit.baldawa
 *
 * This module initializes all the pre-requisites and then starts the HTTP server
 */

import express from 'express';
import { createDBConnection } from './database/dbConnection';
import { getRootRouter } from './rest-api/routes';
import logger from './logger';
import { getMongoDbUrl, getPort } from './config/env';

/**
 * @public
 *
 * Async method which does all the standard server startup routine.
 */
const start = async (): Promise<void> => {
  try {
    const PORT = getPort();
    const mongoDbUrl = getMongoDbUrl();

    const app = express();

    // 1. Add middlewares
    app.use(express.json());
    app.use(getRootRouter());

    // 2. Connect to mongoDB
    await createDBConnection(mongoDbUrl);
    logger.info('Connected to MongoDB.');

    // 3. Start HTTP server
    await new Promise<void>((resolve, reject) => {
      app.listen(PORT, resolve).on('error', reject);
    });
    logger.info(`Server is listening on port = ${PORT}`);
  } catch (err) {
    logger.error(
      `Error while starting server. Error: ${(err as Error).stack}. Exiting...`
    );
    process.exit(1);
  }
};

if (require.main === module) {
  start();
}

export { start };
