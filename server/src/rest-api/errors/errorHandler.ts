/**
 * @author: abhijit.baldawa
 */

import { StatusCodes } from 'http-status-codes';
import { ValidationError } from './validationError';
import { DatabaseError } from '../../errors';

/**
 * @public
 *
 * Central error handler for REST api calls which inspects
 * error and returns appropriate status code and error message
 *
 * @param error
 * @param errMsgIfNoMatch
 */
const getErrorDetails = (
  error: ValidationError | DatabaseError | Error,
  errMsgIfNoMatch: string
) => {
  let statusCode: StatusCodes;
  let errorMessage: string;

  if (error instanceof ValidationError) {
    [statusCode, errorMessage] = [error.statusCode, error.message];
  } else if (error instanceof DatabaseError) {
    [statusCode, errorMessage] = [
      StatusCodes.INTERNAL_SERVER_ERROR,
      error.message,
    ];
  } else {
    [statusCode, errorMessage] = [
      StatusCodes.INTERNAL_SERVER_ERROR,
      `${errMsgIfNoMatch}. Reason -> ${error.message}`,
    ];
  }

  return { statusCode, errorMessage };
};

export { getErrorDetails };
