import * as argon2 from "argon2";

export const hashPassword = async (password: string): Promise<string> => {
    const hashedPassword = await argon2.hash(password);
    return hashedPassword;
}

export const verifyPassword = async (hashedPassword: string, password: string) => {
    const valid = await argon2.verify(hashedPassword, password);
    if (valid) {
        return true;
    }
    return false;
};
