import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';

const routes = new Router();

routes.post('/teste', SessionController.index);

routes.post('/users', UserController.store);

routes.get('/index', (req, res) => {
  return res.json();
});

export default routes;
