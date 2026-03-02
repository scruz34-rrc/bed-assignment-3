import { eventSchemas } from "../../../src/api/v1/validation/eventSchemas";

describe("Event Validation Schemas", () => {
    describe("create event schema", () => {
        it("should validate a valid event creation request", () => {
            // Arrange
            const validEvent = {
                name: "Tech Conference 2024",
                date: "2027-01-15T09:00:00.000Z", // Future date
                capacity: 100
            };

            // Act
            const { error } = eventSchemas.create.body.validate(validEvent);

            // Assert
            expect(error).toBeUndefined();
        });

        it("should validate a valid event with all optional fields", () => {
            // Arrange
            const validEvent = {
                name: "Workshop",
                date: "2027-02-20T14:00:00.000Z",
                capacity: 25,
                registrationCount: 10,
                status: "active",
                category: "workshop"
            };

            // Act
            const { error } = eventSchemas.create.body.validate(validEvent);

            // Assert
            expect(error).toBeUndefined();
        });

        it("should fail when name is missing", () => {
            // Arrange
            const invalidEvent = {
                date: "2027-01-15T09:00:00.000Z",
                capacity: 100
            };

            // Act
            const { error } = eventSchemas.create.body.validate(invalidEvent);

            // Assert
            expect(error).toBeDefined();
            expect(error?.details[0].message).toContain("name");
        });

        it("should fail when name is too short", () => {
            // Arrange
            const invalidEvent = {
                name: "AB", // less than 3 characters
                date: "2027-01-15T09:00:00.000Z",
                capacity: 100
            };

            // Act
            const { error } = eventSchemas.create.body.validate(invalidEvent);

            // Assert
            expect(error).toBeDefined();
            expect(error?.details[0].message).toContain("at least 3 characters");
        });

        it("should fail when date is missing", () => {
            // Arrange
            const invalidEvent = {
                name: "Conference",
                capacity: 100
            };

            // Act
            const { error } = eventSchemas.create.body.validate(invalidEvent);

            // Assert
            expect(error).toBeDefined();
            expect(error?.details[0].message).toContain("date");
        });

        it("should fail when date is not in ISO format", () => {
            // Arrange
            const invalidEvent = {
                name: "Conference",
                date: "2025/01/15",
                capacity: 100
            };

            // Act
            const { error } = eventSchemas.create.body.validate(invalidEvent);

            // Assert
            expect(error).toBeDefined();
            expect(error?.details[0].message).toContain("ISO date");
        });

        it("should fail when date is in the past", () => {
            // Arrange
            const pastDate = new Date();
            pastDate.setDate(pastDate.getDate() - 1); // Yesterday
            const invalidEvent = {
                name: "Conference",
                date: pastDate.toISOString(),
                capacity: 100
            };

            // Act
            const { error } = eventSchemas.create.body.validate(invalidEvent);

            // Assert
            expect(error).toBeDefined();
            expect(error?.details[0].message).toContain("\"date\" must be greater than \"now\"");
        });

        it("should fail when capacity is missing", () => {
            // Arrange
            const invalidEvent = {
                name: "Conference",
                date: "2027-01-15T09:00:00.000Z"
            };

            // Act
            const { error } = eventSchemas.create.body.validate(invalidEvent);

            // Assert
            expect(error).toBeDefined();
            expect(error?.details[0].message).toContain("capacity");
        });

        it("should fail when capacity is less than 5", () => {
            // Arrange
            const invalidEvent = {
                name: "Conference",
                date: "2027-01-15T09:00:00.000Z",
                capacity: 3
            };

            // Act
            const { error } = eventSchemas.create.body.validate(invalidEvent);

            // Assert
            expect(error).toBeDefined();
            expect(error?.details[0].message).toContain("greater than or equal to 5");
        });

        it("should fail when capacity is not an integer", () => {
            // Arrange
            const invalidEvent = {
                name: "Conference",
                date: "2027-01-15T09:00:00.000Z",
                capacity: 10.5
            };

            // Act
            const { error } = eventSchemas.create.body.validate(invalidEvent);

            // Assert
            expect(error).toBeDefined();
            expect(error?.details[0].message).toContain("integer");
        });

        it("should fail when registrationCount exceeds capacity", () => {
            // Arrange
            const invalidEvent = {
                name: "Conference",
                date: "2027-01-15T09:00:00.000Z",
                capacity: 100,
                registrationCount: 150
            };

            // Act
            const { error } = eventSchemas.create.body.validate(invalidEvent);

            // Assert
            expect(error).toBeDefined();
            expect(error?.details[0].message).toContain("less than or equal to");
        });

        it("should fail when status is not valid", () => {
            // Arrange
            const invalidEvent = {
                name: "Conference",
                date: "2027-01-15T09:00:00.000Z",
                capacity: 100,
                status: "invalid_status"
            };

            // Act
            const { error } = eventSchemas.create.body.validate(invalidEvent);

            // Assert
            expect(error).toBeDefined();
            expect(error?.details[0].message).toContain("must be one of");
        });

        it("should fail when category is not valid", () => {
            // Arrange
            const invalidEvent = {
                name: "Conference",
                date: "2027-01-15T09:00:00.000Z",
                capacity: 100,
                category: "invalid_category"
            };

            // Act
            const { error } = eventSchemas.create.body.validate(invalidEvent);

            // Assert
            expect(error).toBeDefined();
            expect(error?.details[0].message).toContain("must be one of");
        });

        it("should set default values for optional fields", () => {
            // Arrange
            const eventWithMinimalFields = {
                name: "Conference",
                date: "2027-01-15T09:00:00.000Z",
                capacity: 100
            };

            // Act
            const { value, error } = eventSchemas.create.body.validate(eventWithMinimalFields);

            // Assert
            expect(error).toBeUndefined();
            expect(value).toHaveProperty("registrationCount", 0);
            expect(value).toHaveProperty("status", "active");
            expect(value).toHaveProperty("category", "general");
        });
    });
});