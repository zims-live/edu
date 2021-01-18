import jwt from "jsonwebtoken";

type User = {
    handle: string,
    email: string,
    firstname: string,
    lastname: string,
    password: string
}

export const generateToken = (user: User): string => {
    return jwt.sign(user, process.env.JWT_SECRET, {
        expiresIn: "1h"
    });
};
