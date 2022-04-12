/**
 * @author: abhijit.baldawa
 */

interface ApiSuccessResponse<ResponsePayload> {
  data: ResponsePayload;
}

interface ApiErrorResponse {
  error: {
    code: number;
    message: string;
  };
}

type ControllerFun<
  Body = any,
  Params = any,
  Query = any,
  ReturnType = any,
  Req = never,
  Res = any
> = (args: {
  body?: Body;
  params?: Params;
  query?: Query;
  req?: Req;
  res?: Res;
}) => Promise<ReturnType | void> | ReturnType | void;

export { ApiSuccessResponse, ApiErrorResponse, ControllerFun };
