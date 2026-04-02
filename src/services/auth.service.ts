import { userRepository } from '../repositories/user.repository'
import { hashedPassword, comparePassword } from '../utils/hash.util'
import { generateToken } from '../utils/jwt.util'
import { Role } from '../types/enums'
import type { RegisterInput, LoginInput } from '../validators/auth.validator'
import { AppError } from '../middleware/error.middleware'

export const authService = {
    register: async (data: RegisterInput) => {
        const existingUser = await userRepository.findByEmail(data.email)
        if (existingUser) {
            throw new AppError('User already exists', 400)
        }

        const hashed = await hashedPassword(data.password)
        const user = await userRepository.create({
            name: data.name,
            email: data.email,
            password: hashed,
            role: (data.role as Role) ?? Role.VIEWER,
        })

        const token = generateToken({ id: user.id, email: user.email, role: user.role })
        return { user, token }
    },

    login: async (data: LoginInput) => {
        const user = await userRepository.findByEmail(data.email)
        if (!user) {
            throw new AppError('Invalid credentials', 400)
        }
        if (!user.isActive) {
            throw new AppError('Account is inactive', 400)
        }
        const isMatch = await comparePassword(data.password, user.password)
        if (!isMatch) {
            throw new AppError('Invalid credentials', 400)
        }

        const token = generateToken({ id: user.id, email: user.email, role: user.role })
        return { user, token }
    },
}
