import { PrismaClient, Role } from '../src/generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main(): Promise<void> {
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Seed users
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

    console.log('Users seeded:', { admin: admin.email, viewer: viewer.email, analyst: analyst.email });

    // Seed sample financial records for the analyst user
    const records = [
        { amount: 5000, type: 'INCOME' as const, category: 'Salary', description: 'Monthly salary', date: new Date('2024-01-01') },
        { amount: 1200, type: 'EXPENSE' as const, category: 'Rent', description: 'Monthly rent', date: new Date('2024-01-05') },
        { amount: 300, type: 'EXPENSE' as const, category: 'Groceries', description: 'Weekly groceries', date: new Date('2024-01-10') },
        { amount: 800, type: 'INCOME' as const, category: 'Freelance', description: 'Freelance project', date: new Date('2024-01-15') },
        { amount: 150, type: 'EXPENSE' as const, category: 'Utilities', description: 'Electricity & water', date: new Date('2024-01-20') },
    ];

    for (const record of records) {
        await prisma.financialRecord.create({
            data: {
                ...record,
                userId: analyst.id,
            },
        });
    }

    console.log('Financial records seeded:', records.length, 'records');
    console.log('\n🌱 Seed complete!');
    console.log('   Credentials for all users: password = admin123');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });