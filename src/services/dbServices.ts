// src/services/dbService.ts
import { queryDatabase } from '../config/db';

export const executeQuery = async <T>(query: string, params: any[]): Promise<T> => {
    try {
        return await queryDatabase(query, params);
    } catch (err) {
        throw new Error('Database error:');
    }
};
