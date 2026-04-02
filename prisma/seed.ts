import { PrismaClient, Role } from '../src/generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main(): Promise<void> {
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const admin = await prisma.user.upsert({
        where: { email: 'admin@finance.com' },
        update: {},
        create: {
            name: 'Admin User',
            email: 'admin@finance.com',
            password: hashedPassword,
            role: Role.ADMIN,
        },
    });

    const viewer = await prisma.user.upsert({
        where: { email: 'viewer@finance.com' },
        update: {},
        create: {
            name: 'Viewer User',
            email: 'viewer@finance.com',
            password: hashedPassword,
            role: Role.VIEWER,
        },
    });

    const analyst = await prisma.user.upsert({
        where: { email: 'analyst@finance.com' },
        update: {},
        create: {
            name: 'Analyst User',
            email: 'analyst@finance.com',
            password: hashedPassword,
            role: Role.ANALYST,
        },
    });

    console.log({ admin, viewer, analyst });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });