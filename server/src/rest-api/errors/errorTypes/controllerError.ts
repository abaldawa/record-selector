import { StatusCodes } from 'http-status-codes';

class ControllerError extends Error {
  public statusCode: StatusCodes;

  constructor(statusCode: StatusCodes, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export { ControllerError };
