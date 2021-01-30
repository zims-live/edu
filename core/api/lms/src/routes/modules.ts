import express, { Router } from 'express';
import {
  createModule,
  enrollModule,
  listEnrolledModules,
  listTeachModules,
  teachModule
} from '../handlers/module';

const modules: Router = express.Router();

modules.post('/modules/create', createModule);
modules.post('/modules/enroll', enrollModule);
modules.post('/modules/teach', teachModule);
modules.get('/modules/enroll', listEnrolledModules);
modules.get('/modules/teach', listTeachModules);

export default modules;
