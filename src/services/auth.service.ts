import { userRepository } from '../repositories/user.repository'
import { hashedPassword, comparePassword } from '../utils/hash.util'
import { generateToken } from '../utils/jwt.util'
import { Role } from '../types/enums'
import type { RegisterInput, LoginInput } from '../validators/auth.validator'

export const authService = {
    register: async (data: RegisterInput) => {
        const existingUser = await userRepository.findByEmail(data.email)
        if (existingUser) {
            throw new Error('User already exists')
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
            throw new Error('Invalid credentials')
        }
        if (!user.isActive) {
            throw new Error('Account is inactive');
        }
        const isMatch = await comparePassword(data.password, user.password)
        if (!isMatch) {
            throw new Error('Invalid credentials')
        }

        const token = generateToken({ id: user.id, email: user.email, role: user.role })
        return { user, token }
    },
}
