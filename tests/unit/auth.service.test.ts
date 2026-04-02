import { authService } from '../../src/services/auth.service'
import { prismaMock } from '../mocks/prisma'
import { Role } from '../../src/types/enums'
import bcrypt from 'bcryptjs'
import * as jwtUtil from '../../src/utils/jwt.util'

jest.mock('../../src/utils/jwt.util')

describe('Auth Service', () => {
    describe('register', () => {
        it('should create a new user and return a token', async () => {
            const userData = { name: 'Test', email: 'test@test.com', password: 'password123', role: Role.ADMIN }
            const createdUser = { id: '1', ...userData, password: 'hashedpassword', isActive: true, createdAt: new Date(), updatedAt: new Date() }
            
            prismaMock.user.findUnique.mockResolvedValue(null)
            prismaMock.user.create.mockResolvedValue(createdUser)
            ;(jwtUtil.generateToken as jest.Mock).mockReturnValue('mocked_token')

            const result = await authService.register(userData)

            expect(prismaMock.user.create).toHaveBeenCalledTimes(1)
            expect(result.token).toBe('mocked_token')
            expect(result.user.email).toBe(userData.email)
        })

        it('should throw an error if user already exists', async () => {
            const userData = { name: 'Test', email: 'test@test.com', password: 'password123' }
            
            // Mock that user already exists
            prismaMock.user.findUnique.mockResolvedValue({ id: '1', ...userData, role: Role.VIEWER, isActive: true, createdAt: new Date(), updatedAt: new Date() })

            await expect(authService.register(userData)).rejects.toThrow('User already exists')
        })
    })

    describe('login', () => {
        it('should successfully login and return a token', async () => {
            const hashedPassword = await bcrypt.hash('password123', 10)
            const user = { id: '1', name: 'Test', email: 'test@test.com', password: hashedPassword, role: Role.ADMIN, isActive: true, createdAt: new Date(), updatedAt: new Date() }
            
            prismaMock.user.findUnique.mockResolvedValue(user)
            ;(jwtUtil.generateToken as jest.Mock).mockReturnValue('mocked_token')

            const result = await authService.login({ email: 'test@test.com', password: 'password123' })

            expect(result.token).toBe('mocked_token')
            expect(result.user.email).toBe(user.email)
        })

        it('should throw an error for invalid credentials', async () => {
            prismaMock.user.findUnique.mockResolvedValue(null)

            await expect(authService.login({ email: 'test@test.com', password: 'wrongpassword' })).rejects.toThrow('Invalid credentials')
        })

        it('should throw an error if account is inactive', async () => {
            const user = { id: '1', name: 'Test', email: 'test@test.com', password: 'hashedpassword', role: Role.ADMIN, isActive: false, createdAt: new Date(), updatedAt: new Date() }
            prismaMock.user.findUnique.mockResolvedValue(user)

            await expect(authService.login({ email: 'test@test.com', password: 'password123' })).rejects.toThrow('Account is inactive')
        })
    })
})
