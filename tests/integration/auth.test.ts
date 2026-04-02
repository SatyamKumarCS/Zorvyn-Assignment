import request from 'supertest'
import app from '../../src/app'
import { prismaMock } from '../mocks/prisma'
import { Role } from '../../src/types/enums'
import bcrypt from 'bcryptjs'

describe('Auth API', () => {
    describe('POST /api/auth/register', () => {
        it('should register a new user successfully', async () => {
            const userData = { name: 'Test', email: 'test@test.com', password: 'password123', role: Role.ADMIN }
            const createdUser = { id: '1', ...userData, password: 'hashedpassword', isActive: true, createdAt: new Date(), updatedAt: new Date() }
            
            prismaMock.user.findUnique.mockResolvedValue(null)
            prismaMock.user.create.mockResolvedValue(createdUser)

            const res = await request(app)
                .post('/api/auth/register')
                .send(userData)

            expect(res.statusCode).toEqual(201)
            expect(res.body.success).toBe(true)
            expect(res.body.data).toHaveProperty('token')
            expect(res.body.data.user.email).toBe(userData.email)
        })

        it('should fail if email is already registered', async () => {
            const userData = { name: 'Test', email: 'test@test.com', password: 'password123' }
            
            prismaMock.user.findUnique.mockResolvedValue({ id: '1', ...userData, role: 'VIEWER', isActive: true, createdAt: new Date(), updatedAt: new Date() })

            const res = await request(app)
                .post('/api/auth/register')
                .send(userData)

            expect(res.statusCode).toEqual(400)
            expect(res.body.success).toBe(false)
            expect(res.body.message).toBe('User already exists')
        })
    })

    describe('POST /api/auth/login', () => {
        it('should login an existing active user successfully', async () => {
            const hashedPassword = await bcrypt.hash('password123', 10)
            const user = { id: '1', name: 'Test', email: 'test@test.com', password: hashedPassword, role: Role.ADMIN, isActive: true, createdAt: new Date(), updatedAt: new Date() }
            
            prismaMock.user.findUnique.mockResolvedValue(user)

            const res = await request(app)
                .post('/api/auth/login')
                .send({ email: 'test@test.com', password: 'password123' })

            expect(res.statusCode).toEqual(200)
            expect(res.body.success).toBe(true)
            expect(res.body.data).toHaveProperty('token')
        })

        it('should fail for suspended/inactive user', async () => {
            const hashedPassword = await bcrypt.hash('password123', 10)
            const user = { id: '1', name: 'Test', email: 'test@test.com', password: hashedPassword, role: Role.ADMIN, isActive: false, createdAt: new Date(), updatedAt: new Date() }
            
            prismaMock.user.findUnique.mockResolvedValue(user)

            const res = await request(app)
                .post('/api/auth/login')
                .send({ email: 'test@test.com', password: 'password123' })

            expect(res.statusCode).toEqual(400)
            expect(res.body.message).toBe('Account is inactive')
        })
    })
})
