/**
 * @author: abhijit.baldawa
 */

import { ControllerFun } from './controller';

interface Route {
  method: 'get' | 'put' | 'post' | 'delete' | 'patch';
  path: string;
  controller: ControllerFun[];
}

export { Route };
