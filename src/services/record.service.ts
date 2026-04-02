import { recordRepository } from '../repositories/record.repository';
import { getPaginationParams, createPaginatedResponse } from '../utils/pagination.util';
import { RecordType } from '../types/enums';
import type { CreateRecordInput, UpdateRecordInput, FilterRecordInput } from '../validators/record.validator';
import { AppError } from '../middleware/error.middleware';

export const recordService = {
    createRecord: async (data: CreateRecordInput, userId: string) => {
        return recordRepository.create({
            ...data,
            type: data.type as RecordType,
            userId,
        });
    },

    getAllRecords: async (filters: FilterRecordInput, page?: number, limit?: number) => {
        const pagination = getPaginationParams(page, limit);
        const { records, total } = await recordRepository.findAll(
            { ...filters, type: filters.type as RecordType | undefined },
            pagination
        );
        return createPaginatedResponse(records, total, pagination.page, pagination.limit);
    },

    getRecordById: async (id: string) => {
        const record = await recordRepository.findById(id);
        if (!record) {
            throw new AppError('Record not found', 404);
        }
        return record;
    },

    updateRecord: async (id: string, data: UpdateRecordInput) => {
        const record = await recordRepository.findById(id);
        if (!record) {
            throw new AppError('Record not found', 404);
        }
        return recordRepository.update(id, {
            ...data,
            type: data.type as RecordType | undefined,
        });
    },

    deleteRecord: async (id: string) => {
        const record = await recordRepository.findById(id);
        if (!record) {
            throw new AppError('Record not found', 404);
        }
        return recordRepository.softDelete(id);
    },
};