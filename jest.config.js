module.exports = {
    coverageDirectory: 'coverage',
    globals: {
        'ts-jest': {
            tsConfig: {
                inlineSourceMap: true,
                module: 'commonjs',
                paths: {
                    '@apestaartje/lip/*': [
                        'src/*',
                    ],
                },
                sourceMap: false,
            },
        },
    },
    moduleNameMapper: {
        '^@apestaartje/lip/(.*)$': '<rootDir>/src/$1',
    },
    preset: 'ts-jest',
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
        '^.+\\.jsx?$': 'babel-jest',
    },
    transformIgnorePatterns: [
        '/node_modules/(?!@apestaartje).+(js|jsx)$',
    ],
    setupFilesAfterEnv: [
        './jest.setup.js',
    ],
};
