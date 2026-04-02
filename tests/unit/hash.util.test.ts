import { hashedPassword, comparePassword } from '../../src/utils/hash.util'
import bcrypt from 'bcryptjs'

describe('Hash Util', () => {
    describe('hashedPassword', () => {
        it('should return a hashed string', async () => {
            const password = 'mySecretPassword'
            const hashed = await hashedPassword(password)
            expect(hashed).toBeDefined()
            expect(hashed).not.toBe(password)
        })
    })

    describe('comparePassword', () => {
        it('should return true for correct password', async () => {
            const password = 'mySecretPassword'
            const hashed = await bcrypt.hash(password, 10)
            const result = await comparePassword(password, hashed)
            expect(result).toBe(true)
        })

        it('should return false for incorrect password', async () => {
            const password = 'mySecretPassword'
            const hashed = await bcrypt.hash(password, 10)
            const result = await comparePassword('wrongPassword', hashed)
            expect(result).toBe(false)
        })
    })
})
