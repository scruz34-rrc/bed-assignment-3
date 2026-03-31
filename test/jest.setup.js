// Always mock firebase in every test
jest.mock("../config/firebaseConfig", () => ({
    db: {
        collection: jest.fn().mockReturnThis(),
        doc: jest.fn().mockReturnThis(),
        get: jest.fn(),
        add: jest.fn(),
        set: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        runTransaction: jest.fn(),
        batch: jest.fn().mockReturnValue({
            set: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            commit: jest.fn()
        })
    }
}));

// Reset all mocks after each test
afterEach(() => {
    jest.clearAllMocks();
});

// Cleanup after all tests
afterAll(() => {
    jest.resetModules();
});