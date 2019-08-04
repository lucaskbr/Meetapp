import { Router } from 'express';

import multer from 'multer';

import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import FileController from './app/controllers/FileController';
import MeetupController from './app/controllers/MeetupController';
import MeetupManagementController from './app/controllers/MeetupManagementController';
import SubscriptionController from './app/controllers/SubscriptionController';

import AuthMiddleware from './app/middlewares/auth';

import multerConfig from './config/multer';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/login', SessionController.index);

routes.post('/users', UserController.store);

routes.use(AuthMiddleware);

routes.post('/files', upload.single('file'), FileController.store);

routes.get('/meetups/management', MeetupManagementController.index);
routes.post('/meetups/management', MeetupManagementController.store);
routes.put('/meetups/management/:id', MeetupManagementController.update);
routes.delete('/meetups/management/:id', MeetupManagementController.delete);

routes.get('/subscriptions', SubscriptionController.index);
routes.post('/subscriptions/:id', SubscriptionController.store);

routes.get('/meetups', MeetupController.index);

export default routes;
