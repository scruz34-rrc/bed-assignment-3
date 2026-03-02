import { Request, Response, NextFunction } from "express";
import { validateRequest } from "../../../src/api/v1/middleware/validation";
import Joi from "joi";

// Mock HTTP status constants
jest.mock("../../../src/constants/httpConstants", () => ({
    HTTP_STATUS: {
        BAD_REQUEST: 400,
        INTERNAL_SERVER_ERROR: 500
    }
}));

describe("validateRequest Middleware", () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        mockReq = {
            body: {},
            params: {},
            query: {},
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        mockNext = jest.fn();
    });

    describe("Body Validation", () => {
        it("should pass for valid body input", () => {
            // Arrange
            const testSchemas = {
                body: Joi.object({
                    name: Joi.string().required().min(3),
                    capacity: Joi.number().required().min(5),
                    date: Joi.string().isoDate().required()
                }),
            };
            mockReq.body = { 
                name: "Tech Conference 2024", 
                capacity: 100,
                date: "2024-12-25T10:00:00.000Z"
            };
            const middleware = validateRequest(testSchemas);

            // Act
            middleware(mockReq as Request, mockRes as Response, mockNext);

            // Assert
            expect(mockNext).toHaveBeenCalled();
            expect(mockRes.status).not.toHaveBeenCalled();
            expect(mockRes.json).not.toHaveBeenCalled();
        });

        it("should fail for invalid body input with missing required field", () => {
            // Arrange
            const testSchemas = {
                body: Joi.object({
                    name: Joi.string().required().min(3),
                    capacity: Joi.number().required().min(5)
                }),
            };
            mockReq.body = { name: "Tech Conference" }; // missing capacity
            const middleware = validateRequest(testSchemas);

            // Act
            middleware(mockReq as Request, mockRes as Response, mockNext);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: expect.stringContaining("Validation error")
                })
            );
            expect(mockNext).not.toHaveBeenCalled();
        });

        it("should fail when string is too short", () => {
            // Arrange
            const testSchemas = {
                body: Joi.object({
                    name: Joi.string().required().min(3)
                }),
            };
            mockReq.body = { name: "AB" }; // too short
            const middleware = validateRequest(testSchemas);

            // Act
            middleware(mockReq as Request, mockRes as Response, mockNext);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: expect.stringContaining("length must be at least 3")
                })
            );
        });

        it("should fail when capacity is below minimum", () => {
            // Arrange
            const testSchemas = {
                body: Joi.object({
                    capacity: Joi.number().required().min(5)
                }),
            };
            mockReq.body = { capacity: 3 }; // below minimum
            const middleware = validateRequest(testSchemas);

            // Act
            middleware(mockReq as Request, mockRes as Response, mockNext);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: expect.stringContaining("must be greater than or equal to 5")
                })
            );
        });
    });

    describe("Params Validation", () => {
        it("should validate params correctly", () => {
            // Arrange
            const testSchemas = {
                params: Joi.object({
                    id: Joi.string().required().pattern(/^evt_\d{6}$/)
                }),
            };
            mockReq.params = { id: "evt_000001" };
            const middleware = validateRequest(testSchemas);

            // Act
            middleware(mockReq as Request, mockRes as Response, mockNext);

            // Assert
            expect(mockNext).toHaveBeenCalled();
        });

        it("should fail when required params are missing", () => {
            // Arrange
            const testSchemas = {
                params: Joi.object({
                    id: Joi.string().required()
                }),
            };
            mockReq.params = {}; // missing id
            const middleware = validateRequest(testSchemas);

            // Act
            middleware(mockReq as Request, mockRes as Response, mockNext);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: expect.stringContaining("Validation error")
                })
            );
            expect(mockNext).not.toHaveBeenCalled();
        });
    });

    describe("Multiple Request Parts Validation", () => {
        it("should validate body, params, and query together", () => {
            // Arrange
            const testSchemas = {
                params: Joi.object({
                    id: Joi.string().required()
                }),
                body: Joi.object({
                    name: Joi.string().required(),
                    capacity: Joi.number().min(5)
                }),
                query: Joi.object({
                    include: Joi.string().valid("details", "summary").optional()
                }),
            };
            mockReq.params = { id: "evt_000001" };
            mockReq.body = { name: "Updated Conference", capacity: 150 };
            mockReq.query = { include: "details" };
            const middleware = validateRequest(testSchemas);

            // Act
            middleware(mockReq as Request, mockRes as Response, mockNext);

            // Assert
            expect(mockNext).toHaveBeenCalled();
        });
    });

    describe("Strip Unknown Options", () => {
        it("should strip unknown fields when stripBody is true", () => {
            // Arrange
            const testSchemas = {
                body: Joi.object({
                    name: Joi.string().required()
                })
            };
            mockReq.body = { 
                name: "Test Event", 
                unknownField: "should be stripped" 
            };
            const middleware = validateRequest(testSchemas, { stripBody: true });

            // Act
            middleware(mockReq as Request, mockRes as Response, mockNext);

            // Assert
            expect(mockNext).toHaveBeenCalled();
            expect(mockReq.body).not.toHaveProperty("unknownField");
            expect(mockReq.body).toHaveProperty("name", "Test Event");
        });
    });
});