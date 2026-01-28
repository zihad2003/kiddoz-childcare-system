module.exports = {
    testEnvironment: 'node',
    verbose: true,
    silent: false,
    collectCoverageFrom: [
        'routes/**/*.js',
        'utils/**/*.js',
        'middleware/**/*.js',
        '!**/node_modules/**',
        '!**/vendor/**'
    ],
    coverageDirectory: 'coverage',
    testPathIgnorePatterns: ['/node_modules/']
};
