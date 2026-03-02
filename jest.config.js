module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["<rootDir>/test"],
    testMatch: ["**/*.test.ts"],
    setupFilesAfterEnv: ["<rootDir>/test/jest.setup.js"],
    collectCoverageFrom: [
        "src/**/*.ts",
        "!src/**/*.d.ts",
        "!src/server.ts"
    ],
    coverageDirectory: "coverage",
    verbose: true
};