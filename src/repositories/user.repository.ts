import { prisma } from "../config/db";
import { Role } from '../generated/prisma';

export const userRepository = {
    findByEmail: async (email: string) => {
        return prisma.user.findUnique({ where: { email } });
    },

    findById: async (id: string) => {
        return prisma.user.findUnique({ where: { id } });
    },

    findAll: async () => {
        return prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isActive: true,
                createdAt: true,
            },
        });
    },

    create: async (data: { name: string; email: string; password: string; role?: Role }) => {
        return prisma.user.create({ data });
    },

    update: async (id: string, data: Partial<{ name: string, email: string, role?: Role, isActive: boolean }>) => {
        return prisma.user.update({ where: { id }, data })
    },

    delete: async (id: string) => {
        return prisma.user.delete({ where: { id } })
    }
};
