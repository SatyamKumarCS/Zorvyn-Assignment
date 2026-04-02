import request from 'supertest'
import app from '../../src/app'
import { prismaMock } from '../mocks/prisma'
import * as jwtUtil from '../../src/utils/jwt.util'
import { Role } from '../../src/types/enums'

describe('Record API', () => {
    let adminToken: string
    let viewerToken: string

    beforeAll(() => {
        adminToken = jwtUtil.generateToken({ id: '1', email: 'admin@test.com', role: Role.ADMIN })
        viewerToken = jwtUtil.generateToken({ id: '2', email: 'viewer@test.com', role: Role.VIEWER })
    })

    describe('POST /api/records', () => {
        it('should allow admin to create a record', async () => {
            const recordData = { amount: 100, type: 'INCOME', category: 'Salary', date: new Date().toISOString() }
            const createdRecord = { id: 'r1', ...recordData, description: null, isDeleted: false, userId: '1', createdAt: new Date(), updatedAt: new Date(), date: new Date() } as any
            
            prismaMock.user.findUnique.mockResolvedValue({ id: '1', email: 'admin@test.com', role: 'ADMIN', isActive: true } as any)
            prismaMock.financialRecord.create.mockResolvedValue(createdRecord)

            const res = await request(app)
                .post('/api/records')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(recordData)

            expect(res.statusCode).toEqual(201)
            expect(res.body.success).toBe(true)
            expect(res.body.data.id).toBe('r1')
        })

        it('should block viewer from creating a record (RBAC)', async () => {
            const recordData = { amount: 100, type: 'INCOME', category: 'Salary', date: new Date().toISOString() }
            
            prismaMock.user.findUnique.mockResolvedValue({ id: '2', email: 'viewer@test.com', role: 'VIEWER', isActive: true } as any)

            const res = await request(app)
                .post('/api/records')
                .set('Authorization', `Bearer ${viewerToken}`)
                .send(recordData)

            expect(res.statusCode).toEqual(403)
            expect(res.body.message).toBe('You do not have permission to perform this action')
        })
    })

    describe('GET /api/records', () => {
        it('should allow viewer to read records', async () => {
            prismaMock.user.findUnique.mockResolvedValue({ id: '2', email: 'viewer@test.com', role: 'VIEWER', isActive: true } as any)
            
            prismaMock.financialRecord.findMany.mockResolvedValue([])
            prismaMock.financialRecord.count.mockResolvedValue(0)

            const res = await request(app)
                .get('/api/records')
                .set('Authorization', `Bearer ${viewerToken}`)

            expect(res.statusCode).toEqual(200)
            expect(res.body.success).toBe(true)
            expect(Array.isArray(res.body.data.data)).toBe(true)
        })
    })

    describe('DELETE /api/records/:id', () => {
        it('should allow admin to soft delete a record', async () => {
            prismaMock.user.findUnique.mockResolvedValue({ id: '1', email: 'admin@test.com', role: 'ADMIN', isActive: true } as any)
            
            const existingRecord = { id: 'r1', amount: 100, type: 'INCOME', category: 'Salary', description: null, isDeleted: false, userId: '1', createdAt: new Date(), updatedAt: new Date(), date: new Date() } as any
            prismaMock.financialRecord.findFirst.mockResolvedValue(existingRecord)
            
            prismaMock.financialRecord.update.mockResolvedValue({ ...existingRecord, isDeleted: true })

            const res = await request(app)
                .delete('/api/records/r1')
                .set('Authorization', `Bearer ${adminToken}`)

            expect(res.statusCode).toEqual(200)
            expect(res.body.success).toBe(true)
            expect(prismaMock.financialRecord.update).toHaveBeenCalledWith(expect.objectContaining({
                where: { id: 'r1' },
                data: { isDeleted: true }
            }))
        })
    })
})
