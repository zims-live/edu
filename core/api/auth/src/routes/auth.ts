import express, { Router } from "express";
import { 
    login, 
    signup 
} from "../handlers/userAuth";

const auth: Router = express.Router();

auth.post("/login", login);
auth.post("/signup", signup);

export default auth;
