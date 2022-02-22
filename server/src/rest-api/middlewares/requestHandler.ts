/**
 * @author: abhijit.baldawa
 */

import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ControllerFun } from '../types';
import { logRequest } from '../utils';

/**
 * @public
 *
 * Central place to handle ALL requests and does below:
 *   1] Calls all the middlewares responsible to handle the request
 *   2] Gets the final response from the controller and sends that response
 *   3] Logs the total time taken to handle a request
 *
 * @param controllerFuns
 */
const requestHandler =
  (controllerFuns: ControllerFun[]): RequestHandler =>
  async (req, res) => {
    const requestStartTime = +new Date();
    const { body, params, query, method, url } = req;

    try {
      for (const controllerFun of controllerFuns) {
        const controllerResp = await controllerFun({ body, params, query });

        if (controllerResp) {
          res.status(controllerResp.statusCode).send(controllerResp.response);

          const requestEndTime = +new Date();
          const requestTotalTimeTaken = requestEndTime - requestStartTime;

          logRequest(
            method,
            url,
            controllerResp.statusCode,
            requestTotalTimeTaken
          );
          return;
        }
      }

      /**
       * NOTE: This should never happen as the last controller should respond with a response
       */
      throw new Error(`Controller returned empty response`);
    } catch (error) {
      /**
       * NOTE: This should never happen as the controllers should handle all the exception
       *       and respond accordingly
       */
      const statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
      res.status(statusCode).send({
        code: statusCode,
        msg: 'Error processing request',
      });

      const requestEndTime = +new Date();
      const requestTotalTimeTaken = requestEndTime - requestStartTime;
      logRequest(
        method,
        url,
        statusCode,
        requestTotalTimeTaken,
        `Controller error. Reason -> ${error}`
      );
    }
  };

export { requestHandler };
