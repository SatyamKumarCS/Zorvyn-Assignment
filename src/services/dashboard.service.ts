import { recordRepository } from '../repositories/record.repository';

export const dashboardService = {
    getSummary: async () => {
        const { income, expense, categoryTotals, recentRecords } =
            await recordRepository.getSummary();

        const totalIncome = Number(income._sum.amount || 0);
        const totalExpense = Number(expense._sum.amount || 0);

        return {
            totalIncome,
            totalExpense,
            netBalance: totalIncome - totalExpense,
            categoryTotals,
            recentActivity: recentRecords,
        };
    },

    getMonthlyTrends: async () => {
        return recordRepository.getMonthlyTrends();
    },
};