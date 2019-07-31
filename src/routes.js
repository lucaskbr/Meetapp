import { Router } from 'express';

import multer from 'multer';

import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import FileController from './app/controllers/FileController';
import MeetupController from './app/controllers/MeetupController';

import AuthMiddleware from './app/middlewares/auth';

import multerConfig from './config/multer';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/login', SessionController.index);

routes.post('/users', UserController.store);

routes.use(AuthMiddleware);

routes.post('/files', upload.single('file'), FileController.store);

routes.post('/meetups', MeetupController.store);

export default routes;
