import jwt from "jsonwebtoken";
import User from "../types/User";

export const generateToken = (user: User): string => {
    return jwt.sign(user, process.env.JWT_SECRET, {
        expiresIn: "1h"
    });
};
