import express, { Application } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import schools from './routes/schools';
import modules from './routes/modules';

const app: Application = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet());

app.use('/schools', schools);
app.use('/modules', modules);

app.get('/', (_req, res) => {
  res.send('Welcome to ZiMS Classroom API');
});

export default app;
