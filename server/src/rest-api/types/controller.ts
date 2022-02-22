/**
 * @author: abhijit.baldawa
 */

import { StatusCodes } from 'http-status-codes';

type ControllerReturnType<ResponsePayload> = {
  statusCode: StatusCodes;
  response?: ResponsePayload;
};

type ControllerFun<
  Body = any,
  Params = any,
  Query = any,
  ReturnType = any
> = (args: {
  body?: Body;
  params?: Params;
  query?: Query;
}) =>
  | Promise<ControllerReturnType<ReturnType> | void>
  | ControllerReturnType<ReturnType>
  | void;

export { ControllerFun };
