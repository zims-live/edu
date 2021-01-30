import express, { Router } from 'express';
import { createModule, enrollModule, listModules, teachModule } from '../handlers/modules';
import { createSchool, listSchools } from '../handlers/schools';

const lms: Router = express.Router();

lms.post('/modules/create', createModule);
lms.post('/modules/enroll', enrollModule);
lms.post('/modules/teach', enrollModule);
lms.get('/modules', listModules);
lms.post('/create', createSchool);
lms.get('/', listSchools);

export default lms;
