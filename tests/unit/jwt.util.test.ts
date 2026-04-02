import { generateToken, verifyToken } from '../../src/utils/jwt.util'
import jwt from 'jsonwebtoken'
import { Role } from '../../src/types/enums'
import { env } from '../../src/config/env'
describe('JWT Util', () => {
    const payload = { id: '1', email: 'test@test.com', role: Role.ADMIN }

    beforeAll(() => {
        process.env.JWT_SECRET = 'test_secret'
        process.env.JWT_EXPIRES_IN = '1h'
    })

    describe('generateToken', () => {
        it('should generate a valid JWT token', () => {
            const token = generateToken(payload)
            expect(token).toBeDefined()
            expect(typeof token).toBe('string')
            
            const decoded = jwt.verify(token, env.JWT_SECRET as string)
            expect(decoded).toMatchObject(payload)
        })
    })

    describe('verifyToken', () => {
        it('should successfully verify a valid token', () => {
            const token = jwt.sign(payload, env.JWT_SECRET as string)
            const decoded = verifyToken(token)
            expect(decoded).toMatchObject(payload)
        })

        it('should throw an error for an invalid token', () => {
            expect(() => {
                verifyToken('invalid_token')
            }).toThrow()
        })
    })
})
