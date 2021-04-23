import express, { Router } from 'express';
import {
  createModule,
  enrollModule,
  listEnrolledModules,
  listTeachModules,
  teachModule
} from '../handlers/module';
import AuthMiddleware from '../handlers/jwtAuth';

const modules: Router = express.Router();

modules.post('/', createModule);
modules.post('/enroll', AuthMiddleware, enrollModule);
modules.post('/teach', AuthMiddleware, teachModule);
modules.get('/enroll', AuthMiddleware, listEnrolledModules);
modules.get('/teach', AuthMiddleware, listTeachModules);

export default modules;
