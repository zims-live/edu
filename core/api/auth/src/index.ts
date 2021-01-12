import express, { Application } from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import { dbConfig } from './config';
import bodyParser from 'body-parser';

const pool = new Pool(dbConfig);

const app: Application = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get('/', (_req, res) => {
    res.send("Server is running");
});

app.post('/login', async (req, res) => {
    try {
        const handle = req.body.handle;
        const password = req.body.password;
        let query: string = `SELECT * FROM users WHERE handle = '${handle}'`;
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

app.post('/signup', async (req, res) => {
    try {
        const handle = req.body.handle;
        const firstname = req.body.firstname;
        const lastname = req.body.lastname;
        const email = req.body.email;
        const password = req.body.password;
        let query: string = `INSERT INTO users(handle, firstname, lastname,
                                               email, password) VALUES
        ('${handle}', '${firstname}', '${lastname}', '${email}',
         '${password}')`;
        console.log(query);
        res.status(200).send("User has been registered");
    } catch (error) {
        res.status(403).send("Something went wrong..");
    }
});

const PORT: string = process.env.PORT || "5000";
app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});
