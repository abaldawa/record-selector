/**
 * @author: abhijit.baldawa
 *
 * This module exposes 'createDBConnection' method to connect
 * mongoose client to mongodb server
 */

import mongoose, { Mongoose } from 'mongoose';

/**
 * @public
 *
 * This method connects mongoose to mongoDB server
 *
 * @param mongoDbUrl
 */
const createDBConnection = async (mongoDbUrl: string): Promise<Mongoose> => {
  try {
    return await mongoose.connect(mongoDbUrl);
  } catch (error) {
    throw new Error(
      `Error connecting to the mongoDB database. Reason -> ${error}`
    );
  }
};

export { createDBConnection };
