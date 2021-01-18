import express, { Application } from "express";
import cors from "cors";
import { Pool, QueryResult } from "pg";
import { dbConfig } from "./config";
import bodyParser from "body-parser";
import { hashPassword, verifyPassword } from "./utils/argon";
import { generateToken } from "./utils/jwtAuth";


const pool = new Pool(dbConfig);

const app: Application = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (_req, res) => {
    res.send("Server is running");
});

app.post("/login", async (req, res) => {
    try {
        const handle: string = req.body.handle;
        const password: string = req.body.password;
        let query: string = `SELECT * FROM users WHERE handle = $1`;
        const results: QueryResult<any> = await pool.query(query, [handle]);

        if (results.rowCount != 0) {
            const hashedPassword: string = results.rows[0].password;
            const valid = await verifyPassword(hashedPassword, password);
            if (!valid) {
                res.status(403).send("Incorrect password");
            } else {
                const jwtToken = generateToken(results.rows[0]);
                res.status(203).json(jwtToken);
            }
        } else {
            res.status(403).send("Handle doesn't exist");
        }
    } catch (error) {
        console.error(error);
        res.status(403).send("Something went wrong..");
    }
});

app.post("/signup", async (req, res) => {
    try {
        const handle: string = req.body.handle;
        const firstname: string = req.body.firstname;
        const lastname: string = req.body.lastname;
        const email: string = req.body.email;
        const password: string = req.body.password;
        const hashedPassword: string = await hashPassword(password);
        let query: string = `INSERT INTO users(handle, firstname, lastname,
                                               email, password) VALUES ($1, $2, $3, $4, $5)`;
        await pool.query(query, [handle, firstname, lastname, email, hashedPassword]);

        const jwtToken: string = generateToken({
            handle: handle,
            firstname: firstname,
            lastname: lastname,
            password: password,
            email: email
        });
        res.status(203).json(jwtToken);
        res.status(200).send("User has been registered");
    } catch (error) {
        console.error(error);
        res.status(403).send("Something went wrong..");
    }
});

app.get("/users", async (_req, res) => {
    try {
        let query: string = 'SELECT * FROM users';
        const results: QueryResult<any> = await pool.query(query);
        res.json(results.rows);
    } catch (error) {
        console.error(error);
        res.status(403).send("Something went wrong");
    }
});

const PORT: string = process.env.PORT || "5000";
app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});
