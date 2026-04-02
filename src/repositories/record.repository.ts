import { prisma } from '../config/db';
import { RecordType } from '../types/enums';
import type { PaginationParams } from '../utils/pagination.util';

interface RecordFilters {
    type?: RecordType;
    category?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
}

export const recordRepository = {
    create: async (data: { amount: number, type: RecordType, category: string, date: string, description?: string, userId: string }) => {
        return prisma.financialRecord.create({ data: { ...data, amount: data.amount, date: new Date(data.date) }, include: { user: { select: { id: true, name: true, email: true } } } })

    },
    findAll: async (filters: RecordFilters, pagination: PaginationParams) => {
        const where = {
            isDeleted: false,
            ...(filters.type && { type: filters.type }),
            ...(filters.category && { category: filters.category }),
            ...(filters.startDate || filters.endDate
                ? {
                    date: {
                        ...(filters.startDate && { gte: new Date(filters.startDate) }),
                        ...(filters.endDate && { lte: new Date(filters.endDate) }),
                    },
                }
                : {}),
            ...(filters.search && {
                OR: [
                    { category: { contains: filters.search, mode: 'insensitive' as any } },
                    { description: { contains: filters.search, mode: 'insensitive' as any } },
                ],
            }),
        };

        const [records, total] = await Promise.all([
            prisma.financialRecord.findMany({
                where,
                skip: pagination.skip,
                take: pagination.limit,
                orderBy: { date: 'desc' },
                include: { user: { select: { id: true, name: true, email: true } } },
            }),
            prisma.financialRecord.count({ where }),
        ]);

        return { records, total };
    },

    findById: async (id: string) => {
        return prisma.financialRecord.findFirst({
            where: { id, isDeleted: false },
            include: { user: { select: { id: true, name: true, email: true } } },
        });
    },

    update: async (id: string, data: Partial<{ amount: number, type: RecordType, category: string, date: string, description: string }>) => {
        return prisma.financialRecord.update({
            where: { id },
            data: {
                ...data,
                ...(data.date && { date: new Date(data.date) }),
            },
            include: { user: { select: { id: true, name: true, email: true } } },
        });
    },

    softDelete: async (id: string) => {
        return prisma.financialRecord.update({
            where: { id },
            data: { isDeleted: true },
        });
    },

    getSummary: async () => {
        const [income, expense, categoryTotals, recentRecords] = await Promise.all([
            prisma.financialRecord.aggregate({
                where: { type: 'INCOME', isDeleted: false },
                _sum: { amount: true },
            }),
            prisma.financialRecord.aggregate({
                where: { type: 'EXPENSE', isDeleted: false },
                _sum: { amount: true },
            }),
            prisma.financialRecord.groupBy({
                by: ['category', 'type'],
                where: { isDeleted: false },
                _sum: { amount: true },
            }),
            prisma.financialRecord.findMany({
                where: { isDeleted: false },
                orderBy: { date: 'desc' },
                take: 5,
                include: { user: { select: { id: true, name: true } } },
            }),
        ]);

        return { income, expense, categoryTotals, recentRecords };
    },

    getMonthlyTrends: async () => {
        return prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('month', date) as month,
        type,
        SUM(amount) as total
      FROM financial_records
      WHERE "isDeleted" = false
      GROUP BY DATE_TRUNC('month', date), type
      ORDER BY month DESC
      LIMIT 12
    `;
    },
}