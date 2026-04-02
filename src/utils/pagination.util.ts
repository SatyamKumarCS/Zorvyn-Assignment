import { PAGINATION } from '../config/constants';

export interface PaginationParams {
    page: number;
    limit: number;
    skip: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export const getPaginationParams = (
    page?: number,
    limit?: number
): PaginationParams => {
    const validPage = Math.max(1, page || PAGINATION.DEFAULT_PAGE);
    const validLimit = Math.min(
        limit || PAGINATION.DEFAULT_LIMIT,
        PAGINATION.MAX_LIMIT
    );

    return {
        page: validPage,
        limit: validLimit,
        skip: (validPage - 1) * validLimit,
    };
};

export const createPaginatedResponse = <T>(
    data: T[],
    total: number,
    page: number,
    limit: number
): PaginatedResponse<T> => {
    return {
        data,
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
};
