export default {
  testEnvironment: 'node',
  clearMocks: true,
  moduleDirectories: ['node_modules', 'src'],
  testMatch: ['**/tests/**/*.test.ts'],
  setupFilesAfterEnv: ['<rootDir>/tests/mocks/prisma.ts'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.test.json' }]
  }
};
