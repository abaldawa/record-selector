/**
 * @author: abhijit.baldawa
 */

import { Route, ControllerFun } from '../../rest-api/types';
import { getRecordsByFilter } from './record.controller';
import { getRecordsByFilterInputValidator } from './middlewares';

const ROOT_PATH = '/records';

const recordsRoutes: Route[] = [
  {
    method: 'post',
    path: `${ROOT_PATH}/filter`,
    controller: [
      getRecordsByFilterInputValidator as ControllerFun,
      getRecordsByFilter as ControllerFun,
    ],
  },
];

export { recordsRoutes };
