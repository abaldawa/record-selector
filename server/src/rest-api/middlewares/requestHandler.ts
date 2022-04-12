/**
 * @author: abhijit.baldawa
 */

import { Request, RequestHandler, Response } from 'express';
import {
  ApiErrorResponse,
  ApiSuccessResponse,
  ControllerFun,
  Route,
} from '../types';
import { logRequest } from '../utils';
import { getErrorDetails, KnownAndUnknownErrors } from '../errors';

/**
 * @public
 *
 * Central place to handle ALL requests and does below:
 *   1] Calls all the middlewares responsible to handle the request
 *   2] Gets the final response from the controller and sends that response
 *   3] Logs the total time taken to handle a request
 *
 * @param routeConfig
 */
const requestHandler =
  (
    routeConfig: Route
  ): RequestHandler<any, ApiSuccessResponse<any> | ApiErrorResponse> =>
  async (req, res) => {
    const requestStartTime = +new Date();
    const {
      controller: controllerFuns,
      successStatusCode,
      handleRequestManually,
    } = routeConfig;
    const { body, params, query, method, url } = req;

    try {
      if (handleRequestManually) {
        for (const controllerFun of controllerFuns) {
          await (
            controllerFun as ControllerFun<
              any,
              any,
              any,
              any,
              Request,
              Response
            >
          )({
            body,
            params,
            query,
            req,
            res,
          });
        }

        const requestEndTime = +new Date();
        const requestTotalTimeTaken = requestEndTime - requestStartTime;

        logRequest(method, url, successStatusCode, requestTotalTimeTaken);
        return;
      }

      let controllerResp: any;
      for (const controllerFun of controllerFuns) {
        controllerResp = await controllerFun({ body, params, query });

        if (typeof controllerResp !== 'undefined') {
          break;
        }
      }

      res.status(successStatusCode).send({ data: controllerResp });

      const requestEndTime = +new Date();
      const requestTotalTimeTaken = requestEndTime - requestStartTime;

      logRequest(method, url, successStatusCode, requestTotalTimeTaken);
    } catch (error) {
      const { statusCode, errorMessage } = getErrorDetails(
        error as KnownAndUnknownErrors,
        'Error processing request'
      );

      res.status(statusCode).send({
        error: {
          code: statusCode,
          message: errorMessage,
        },
      });

      const requestEndTime = +new Date();
      const requestTotalTimeTaken = requestEndTime - requestStartTime;
      logRequest(method, url, statusCode, requestTotalTimeTaken);
    }
  };

export { requestHandler };
