/**
 * @author: abhijit.baldawa
 */

import { StatusCodes } from 'http-status-codes';
import { ControllerFun } from './controller';

interface Route {
  method: 'get' | 'put' | 'post' | 'delete' | 'patch';
  path: string;
  successStatusCode: StatusCodes;
  handleRequestManually?: boolean;
  controller: ControllerFun[];
}

export { Route };
