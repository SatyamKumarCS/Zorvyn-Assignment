import jwt from "jsonwebtoken";
import { Role } from "../generated/prisma";
import { env } from "../config/env";

interface JwtPayload {
    id: string;
    email: string;
    role: Role;
}

export const generateToken = (payload: JwtPayload): string => {
    return jwt.sign(payload, env.JWT_SECRET as string, {
        expiresIn: env.JWT_EXPIRES_IN,
    } as jwt.SignOptions);
};

export const verifyToken = (token: string): JwtPayload => {
    return jwt.verify(token, env.JWT_SECRET as string) as JwtPayload;
};