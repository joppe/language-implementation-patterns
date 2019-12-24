/*global module*/

module.exports = function (config) {
    const configuration = {
        frameworks: ['jasmine', 'karma-typescript'],

        files: [
            {
                pattern: 'src/**/*.ts'
            },
            {
                pattern: 'test/**/*.ts'
            }
        ],

        preprocessors: {
            'src/**/*.ts': ['karma-typescript'],
            'test/**/*.ts': ['karma-typescript']
        },

        reporters: [
            'progress',
            'karma-typescript'
        ],

        karmaTypescriptConfig: {
            bundlerOptions: {
                transforms: [
                    require('karma-typescript-es6-transform')({
                        presets: [
                            ['env', {
                                targets: {
                                    browsers: ['last 2 Chrome versions']
                                }
                            }]
                        ]
                    })
                ]
            },
            coverageOptions: {
                exclude: [
                    /\.(d|spec|test)\.ts$/i,
                    /node_modules/i
                ]
            },
            exclude: ['demo'],
            include: [
                'src/**/*',
                'test/**/*'
            ],
            reports: {
                lcovonly: {
                    directory: 'coverage',
                    subdirectory: 'lcovonly',
                    filename: 'lcov.info'
                },
                'html': {
                    directory: 'coverage',
                    subdirectory: 'html',
                    filename: 'coverage'
                }
            },
            compilerOptions: {
                module: 'commonjs',
                sourceMap: true
            },
            tsconfig: './tsconfig.json'
        },

        port: 9876,

        colors: true,

        logLevel: config.LOG_WARN,

        autoWatch: false,

        browsers: [
            'ChromeNoSandboxHeadless'
        ],

        customLaunchers: {
            ChromeNoSandboxHeadless: {
                base: 'Chrome',
                flags: [
                    '--no-sandbox',
                    '--headless',
                    '--disable-gpu',
                    '--remote-debugging-port=9222'
                ]
            }
        },

        singleRun: true
    };

    config.set(configuration);
};
