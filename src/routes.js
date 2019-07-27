import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';

import AuthMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/login', SessionController.index);

routes.post('/users', UserController.store);

routes.use(AuthMiddleware);

routes.get('/teste', (req, res) => {
  return res.json({ loko: 'dsadsa' });
});

export default routes;
