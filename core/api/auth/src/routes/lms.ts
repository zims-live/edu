import express, { Router } from 'express';
import {
  createModule,
  enrollModule,
  listEnrolledModules,
  listTeachModules,
  teachModule
} from '../handlers/module';
import { createSchool, listSchools } from '../handlers/school';

const lms: Router = express.Router();

lms.post('/modules/create', createModule);
lms.post('/modules/enroll', enrollModule);
lms.post('/modules/teach', teachModule);
lms.get('/modules/enroll', listEnrolledModules);
lms.get('/modules/teach', listTeachModules);
lms.post('/', createSchool);
lms.get('/', listSchools);

export default lms;
