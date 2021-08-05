/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
    preset: 'ts-jest',

    // Indicates whether the coverage information should be collected while executing the test
    collectCoverage: false,
    collectCoverageFrom: ['<rootDir>/resources/ts/**/*.{ts,tsx}'],

    // The directory where Jest should output its coverage files
    coverageDirectory: 'coverage/jest',

    // An array of regexp pattern strings used to skip coverage collection
    coveragePathIgnorePatterns: ['/node_modules/'],

    // An array of file extensions your modules use
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],

    // A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module
    moduleNameMapper: {
        '@shared/(.*)$': '<rootDir>/resources/ts/shared/$1',
        '@dashboard/(.*)$': '<rootDir>/resources/ts/dashboard/$1',
        '@admin/(.*)$': '<rootDir>/resources/ts/admin/$1',
    },

    // Activates notifications for test results
    notify: true,

    // The test environment that will be used for testing
    testEnvironment: 'jsdom',
};