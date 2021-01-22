import * as argon2 from 'argon2';

export const hashPassword = async (password: string): Promise<string> => {
  try {
    const hashedPassword = await argon2.hash(password);
    return hashedPassword;
  } catch (error) {
    throw new Error(error);
  }
};

export const verifyPassword = async (
  hashedPassword: string,
  password: string
): Promise<boolean> => {
  try {
    const valid = await argon2.verify(hashedPassword, password);
    if (valid) {
      return true;
    }
    return false;
  } catch (error) {
    throw new Error(error);
  }
};
