import { userRepository } from '../repositories/user.repository';
import type { UpdateUserInput } from '../validators/user.validator';
import { Role } from '../types/enums';

export const userService = {
    getAllUsers: async () => {
        return userRepository.findAll();
    },

    getUserById: async (id: string) => {
        const user = await userRepository.findById(id);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    },

    updateUser: async (id: string, data: UpdateUserInput) => {
        const user = await userRepository.findById(id);
        if (!user) {
            throw new Error('User not found');
        }

        return userRepository.update(id, {
            ...data,
            role: data.role as Role | undefined,
        });
    },

    deleteUser: async (id: string) => {
        const user = await userRepository.findById(id);
        if (!user) {
            throw new Error('User not found');
        }
        return userRepository.delete(id);
    },
};