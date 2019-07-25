import { Router } from 'express';

const routes = new Router();

routes.get('/index', (req, res) => {
  return res.json();
});

export default routes;
