/**
 * @author: abhijit.baldawa
 */

import { StatusCodes } from 'http-status-codes';
import { ValidationError, ControllerError } from './errorTypes';
import { DatabaseError } from '../../errors';

type KnownErrors = ValidationError | DatabaseError | ControllerError;
type KnownAndUnknownErrors = KnownErrors | Error;

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
  error: KnownAndUnknownErrors,
  errMsgIfNoMatch: string
) => {
  let statusCode: StatusCodes;
  let errorMessage: string;

  if (error instanceof ValidationError || error instanceof ControllerError) {
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

const isKnownError = (error: KnownAndUnknownErrors) => {
  if (error instanceof ValidationError) {
    return true;
  }

  if (error instanceof DatabaseError) {
    return true;
  }

  if (error instanceof ControllerError) {
    return true;
  }

  return false;
};

export { KnownErrors, KnownAndUnknownErrors, getErrorDetails, isKnownError };
