export default {
    roots: ['<rootDir>/src'],
    testMatch: [
        '**/__tests__/**/*.+(ts|tsx|js)',
        '**/?(*.)+(spec|test).+(ts|tsx|js)',
    ],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    preset: 'ts-jest',
    testEnvironment: 'node',
    collectCoverageFrom: [
        'src/services/auth/authService.ts',
        'src/services/comments/crudCommentService.ts',
        'src/services/posts/crudPostService.ts',
        'src/services/users/crudUserService.ts',
    ],
    // coverageThreshold: {
    //     'src/services/auth/authService.ts': {
    //         statements: 80,
    //         branches: 80,
    //         functions: 80,
    //         lines: 80,
    //     },
    //     'src/services/auth/crudCommentService.ts': {
    //         statements: 80,
    //         branches: 80,
    //         functions: 80,
    //         lines: 80,
    //     },
    //     'src/services/auth/crudPostService.ts': {
    //         statements: 80,
    //         branches: 80,
    //         functions: 80,
    //         lines: 80,
    //     },
    //     'src/services/auth/crudUserService.ts': {
    //         statements: 80,
    //         branches: 80,
    //         functions: 80,
    //         lines: 80,
    //     },
    // },
}
