import * as eventService from "../../../src/api/v1/services/eventService";
import * as firestoreRepository from "../../../src/api/v1/repositories/firestoreRepository";
import { CreateEventRequest, UpdateEventRequest } from "../../../src/api/v1/models/eventInterfaces";

// Mock the repository module
jest.mock("../../../src/api/v1/repositories/firestoreRepository");

describe("Event Service", () => {
    const COLLECTION_NAME = "events";

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("getAllEvents", () => {
        it("should retrieve all events successfully", async () => {
            // Arrange
            const mockSnapshot = {
                forEach: (callback: (doc: any) => void) => {
                    callback({ id: "evt_000001", data: () => ({ name: "Event 1", capacity: 100 }) });
                    callback({ id: "evt_000002", data: () => ({ name: "Event 2", capacity: 50 }) });
                }
            };
            (firestoreRepository.getDocuments as jest.Mock).mockResolvedValue(mockSnapshot);

            // Act
            const result = await eventService.getAllEvents();

            // Assert
            expect(firestoreRepository.getDocuments).toHaveBeenCalledWith(COLLECTION_NAME);
            expect(result).toHaveLength(2);
            expect(result[0]).toHaveProperty("id", "evt_000001");
            expect(result[1]).toHaveProperty("id", "evt_000002");
        });

        it("should handle errors when retrieving events", async () => {
            // Arrange
            const mockError = new Error("Database error");
            (firestoreRepository.getDocuments as jest.Mock).mockRejectedValue(mockError);

            // Act & Assert
            await expect(eventService.getAllEvents()).rejects.toThrow("Failed to delete event");
        });
    });

    describe("getEventById", () => {
        it("should retrieve an event by ID successfully", async () => {
            // Arrange
            const eventId = "evt_000001";
            const mockDoc = {
                exists: true,
                id: eventId,
                data: () => ({ name: "Test Event", capacity: 100 })
            };
            (firestoreRepository.getDocumentById as jest.Mock).mockResolvedValue(mockDoc);

            // Act
            const result = await eventService.getEventById(eventId);

            // Assert
            expect(firestoreRepository.getDocumentById).toHaveBeenCalledWith(COLLECTION_NAME, eventId);
            expect(result).toHaveProperty("id", eventId);
            expect(result).toHaveProperty("name", "Test Event");
        });

        it("should return null when event not found", async () => {
            // Arrange
            (firestoreRepository.getDocumentById as jest.Mock).mockResolvedValue(null);

            // Act
            const result = await eventService.getEventById("nonexistent");

            // Assert
            expect(result).toBeNull();
        });
    });

    describe("createEvent", () => {
        it("should create an event successfully with required fields only", async () => {
            // Arrange
            const eventData: CreateEventRequest = {
                name: "New Event",
                date: "2027-12-25T10:00:00.000Z",
                capacity: 100
            };
    
            // Mock to return a specific ID, but we'll check pattern instead
            (firestoreRepository.createDocument as jest.Mock).mockResolvedValue("evt_000001");

            // Act
            const result = await eventService.createEvent(eventData);

            // Assert
            expect(firestoreRepository.createDocument).toHaveBeenCalled();
    
            // Check that ID exists and follows the pattern instead of exact value
            expect(result).toHaveProperty("id");
            expect(result.id).toMatch(/^evt_\d{6}$/); // Should match pattern evt_000001, evt_000002, etc.
    
            expect(result).toHaveProperty("name", eventData.name);
            expect(result).toHaveProperty("registrationCount", 0);
            expect(result).toHaveProperty("status", "active");
            expect(result).toHaveProperty("category", "general");
            expect(result).toHaveProperty("createdAt");
            expect(result).toHaveProperty("updatedAt");
        });

        it("should create an event with all fields provided", async () => {
            // Arrange
            const eventData: CreateEventRequest = {
                name: "Workshop",
                date: "2024-12-26T14:00:00.000Z",
                capacity: 25,
                registrationCount: 5,
                status: "active",
                category: "workshop"
            };
            
            (firestoreRepository.createDocument as jest.Mock).mockResolvedValue("evt_000004");

            // Act
            const result = await eventService.createEvent(eventData);

            // Assert
            expect(result).toHaveProperty("registrationCount", 5);
            expect(result).toHaveProperty("status", "active");
            expect(result).toHaveProperty("category", "workshop");
        });
    });

    describe("updateEvent", () => {
        it("should update an event successfully", async () => {
            // Arrange
            const eventId = "evt_000001";
            const updates: UpdateEventRequest = {
                name: "Updated Name",
                capacity: 150
            };
            
            // Mock getEventById to return existing event
            const existingEvent = {
                id: eventId,
                name: "Original Name",
                capacity: 100,
                date: "2027-12-25T10:00:00.000Z",
                registrationCount: 0,
                status: "active" as "active", // Use literal type
                category: "general" as "general", // Use literal type
                createdAt: "2024-01-01T00:00:00.000Z",
                updatedAt: "2024-01-01T00:00:00.000Z"
            };
            jest.spyOn(eventService, "getEventById")
                .mockResolvedValueOnce(existingEvent)
                .mockResolvedValueOnce({ ...existingEvent, ...updates });

            (firestoreRepository.updateDocument as jest.Mock).mockResolvedValue(undefined);

            // Act
            const result = await eventService.updateEvent(eventId, updates);

            // Assert
            expect(firestoreRepository.updateDocument).toHaveBeenCalledWith(
                COLLECTION_NAME,
                eventId,
                expect.objectContaining({
                    ...updates,
                    updatedAt: expect.any(String)
                })
            );
            expect(result).toHaveProperty("name", "Updated Name");
        });

        it("should return null when updating non-existent event", async () => {
            // Arrange
            jest.spyOn(eventService, "getEventById").mockResolvedValue(null);

            // Act
            const result = await eventService.updateEvent("nonexistent", { name: "Test" });

            // Assert
            expect(result).toBeNull();
        });
    });

    describe("deleteEvent", () => {
        it("should delete an event successfully", async () => {
            // Arrange
            const eventId = "evt_000001";
            jest.spyOn(eventService, "getEventById").mockResolvedValue({ id: eventId } as any);
            (firestoreRepository.deleteDocument as jest.Mock).mockResolvedValue(undefined);

            // Act
            const result = await eventService.deleteEvent(eventId);

            // Assert
            expect(firestoreRepository.deleteDocument).toHaveBeenCalledWith(COLLECTION_NAME, eventId);
            expect(result).toBe(true);
        });

        it("should return false when deleting non-existent event", async () => {
            // Arrange
            jest.spyOn(eventService, "getEventById").mockResolvedValue(null);

            // Act
            const result = await eventService.deleteEvent("nonexistent");

            // Assert
            expect(result).toBe(false);
        });
    });
});