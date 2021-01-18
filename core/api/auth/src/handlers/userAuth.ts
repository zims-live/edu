import { QueryResult } from "pg";
import { pool } from "../db";
import { hashPassword, verifyPassword } from "../utils/argon";
import { generateToken } from "../utils/jwtAuth";
import { Request, Response } from "express";
import User from "../types/User";

export const login = async (req: Request, res: Response): Promise<Response> => {
    try {
        const handle: string = req.body.handle;
        const password: string = req.body.password;
        const query = `SELECT * FROM users WHERE handle = $1`;
        const results: QueryResult = await pool.query(query, [handle]);

        if (results.rowCount != 0) {
            const hashedPassword: string = results.rows[0].password;
            const valid = await verifyPassword(hashedPassword, password);
            if (!valid) {
                res.status(403).send("Incorrect password");
            } else {
                const user: User = results.rows[0];
                const jwtToken = generateToken(user);
                return res.status(203).json(jwtToken);
            }
        } else {
            return res.status(403).send("Handle doesn't exist");
        }
    } catch (error) {
        console.error(error);
        return res.status(403).send("Something went wrong..");
    }
}

export const signup = async (req: Request, res: Response): Promise<Response> => {
    try {
        const user = req.body;
        const hashedPassword: string = await hashPassword(user.password);
        const query = `INSERT INTO users(handle, firstname, lastname,
                                               email, password) VALUES ($1, $2, $3, $4, $5)`;
        await pool.query(query, [user.handle, user.firstname, user.lastname, user.email, hashedPassword]);
        return res.status(200).send("User has been registered");
    } catch (error) {
        console.error(error);
        return res.status(403).send("Something went wrong..");
    }
}
