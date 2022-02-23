/**
 * @author: abhijit.baldawa
 */

import { StatusCodes } from 'http-status-codes';
import { ControllerFun, Route } from '../../rest-api/types';
import { echoHandler, getRecordsByFilter } from './record.controller';
import { getRecordsByFilterInputValidator } from './middlewares';

const ROOT_PATH = '/records';

const recordsRoutes: Route[] = [
  {
    method: 'post',
    path: `${ROOT_PATH}/filter`,
    successStatusCode: StatusCodes.OK,
    controller: [
      getRecordsByFilterInputValidator as any as ControllerFun,
      getRecordsByFilter as ControllerFun,
    ],
  },
  {
    method: 'post',
    path: `${ROOT_PATH}/echo`,
    successStatusCode: StatusCodes.OK,
    handleRequestManually: true,
    controller: [echoHandler as any as ControllerFun],
  },
];

export { recordsRoutes };
