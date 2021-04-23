import express, { Router } from 'express';
import { createSchool, listSchools } from '../handlers/school';

const schools: Router = express.Router();

schools.post('/', createSchool);
schools.get('/', listSchools);

export default schools;
