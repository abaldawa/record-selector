/**
 * @author: abhijit.baldawa
 */

import { Router } from 'express';
import { recordsRoutes } from '../modules/record/record.routes';
import { requestHandler } from './middlewares/requestHandler';

/**
 * @public
 *
 * Adds all the routes of all the modules and responds with a root router
 */
const getRootRouter = () => {
  const rootRouter = Router();
  const routes = [...recordsRoutes];

  routes.forEach((route) => {
    rootRouter[route.method](route.path, requestHandler(route.controller));
  });

  return rootRouter;
};

export { getRootRouter };
