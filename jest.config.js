module.exports = {
    coverageDirectory: 'coverage',
    globals: {
        'ts-jest': {
            tsConfig: {
                module: 'commonjs',
                paths: {
                    '@apestaartje/lip/*': ['src/*']
                }
            }
        }
    },
    moduleNameMapper: {
        '^@apestaartje/lip/(.*)$': '<rootDir>/src/$1'
    },
    preset: 'ts-jest',
    setupFilesAfterEnv: ['./jest.setup.js']
};
