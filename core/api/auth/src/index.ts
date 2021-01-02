import express, { Application } from 'express';
import cors from 'cors';
import { Pool } from 'pg';

const pool = new Pool({
    host: 'userdb',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'testdata'
});

const app: Application = express();

app.use(cors());

app.get('/', (_req, res) => {
    res.send("Hello");
});

app.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    let query: string = `SELECT * FROM students WHERE email = '${email}'`;
    pool.query(query, (error, results) => {
        if (error) {
            console.error(error);
        } else {
            res.status(200).json(results.rows);
        }
    });
});

app.get('/signup', (_req, res) => {
    res.send("signed up");
});

const PORT: string = process.env.PORT || "5000";
app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});
