import express, { Application } from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import { dbConfig } from './config';
import bodyParser from 'body-parser';

const pool = new Pool(dbConfig);

const app: Application = express();

app.use(cors());
app.use(bodyParser.json())

app.get('/', (_req, res) => {
    res.send("Server is running");
});

app.post('/login', async (req, res) => {
    try {
        console.log(req.body);
        const handle = req.body.handle;
        const password = req.body.password;
        let query: string = `SELECT * FROM users WHERE handle = '${handle}'`;
        console.log(query);
        const results = await pool.query(query);

        if (results.rowCount != 0) {
            const user = results.rows[0]
            if (user.password == password) {
                res.status(203).json(user);
            } else {
                res.status(403).send("Password incorrect");
            }
        } else {
            res.status(403).send("User not found");
        }
    } catch (error) {
        res.status(403).send("Something went wrong..");
    }
});

app.get('/signup', (_req, res) => {
    res.send("asdfasdf");
});

const PORT: string = process.env.PORT || "5000";
app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});
