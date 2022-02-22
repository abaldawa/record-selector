import { StatusCodes } from 'http-status-codes';

class ValidationError extends Error {
  public statusCode: StatusCodes;

  constructor(statusCode: StatusCodes, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export { ValidationError };
