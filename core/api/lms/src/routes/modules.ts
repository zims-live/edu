import express, { Router } from 'express';
import {
  createModule,
  enrollModule,
  listEnrolledModules,
  listTeachModules,
  teachModule
} from '../handlers/module';

const modules: Router = express.Router();

modules.post('/', createModule);
modules.post('/enroll', enrollModule);
modules.post('/teach', teachModule);
modules.get('/enroll', listEnrolledModules);
modules.get('/teach', listTeachModules);

export default modules;
