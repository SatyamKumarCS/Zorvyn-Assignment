import bcrypt from "bcryptjs";
import { SALT_ROUND } from "../config/constants";


export const hashedPassword = async (password: string): Promise<string> => {
    return bcrypt.hash(password, SALT_ROUND)
}

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    return bcrypt.compare(password, hashedPassword)
}