import express, { Application } from "express";
import cors from "cors";
import { Pool } from "pg";
import { dbConfig } from "./config";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";

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
        const handle = req.body.handle;
        const password = req.body.password;
        let query: string = `SELECT * FROM users WHERE handle = $1 AND password = $2`;
        const results = await pool.query(query, [handle, password]);

        if (results.rowCount != 0) {
            const jwtToken = jwt.sign({
                handle: handle,
                password: password
            }, process.env.JWT_SECRET, {
                expiresIn: "1h"
            });
            res.status(203).json(jwtToken);

        } else {
            res.status(403).send("Wrong handle or password");
        }
    } catch (error) {
        console.error(error);
        res.status(403).send("Something went wrong..");
    }
});

app.post("/signup", async (req, res) => {
    try {
        const handle = req.body.handle;
        const firstname = req.body.firstname;
        const lastname = req.body.lastname;
        const email = req.body.email;
        const password = req.body.password;
        let query: string = `INSERT INTO users(handle, firstname, lastname,
                                               email, password) VALUES ($1, $2, $3, $4, $5)`;
        await pool.query(query, [handle, firstname, lastname, email, password]);

        const jwtToken = jwt.sign({
            handle: handle,
            password: password
        }, process.env.JWT_SECRET, {
            expiresIn: "1h"
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
        const results = await pool.query(query);
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
