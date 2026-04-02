import { PrismaClient } from '../../src/generated/prisma'
import { mockDeep, mockReset } from 'jest-mock-extended'
import type { DeepMockProxy } from 'jest-mock-extended'

import { prisma } from '../../src/config/db'

jest.mock('../../src/config/db', () => ({
  __esModule: true,
  prisma: mockDeep<PrismaClient>(),
}))

beforeEach(() => {
  mockReset(prismaMock)
})

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>
