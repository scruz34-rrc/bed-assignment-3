import { Request, Response, NextFunction } from "express";
import * as eventController from "../../../src/api/v1/controllers/eventController";
import * as eventService from "../../../src/api/v1/services/eventService";
import { HTTP_STATUS } from "../../../src/constants/httpConstants";

// Mock the service module
jest.mock("../../../src/api/v1/services/eventService");

describe("Event Controller", () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        jest.clearAllMocks();
        mockReq = {
            params: {},
            body: {},
            query: {}
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn()
        };
        mockNext = jest.fn();
    });

    describe("getAllEventsHandler", () => {
        it("should handle successful retrieval of all events", async () => {
            // Arrange
            const mockEvents = [
                { id: "evt_000001", name: "Conference 2024", capacity: 100 },
                { id: "evt_000002", name: "Workshop", capacity: 25 }
            ];
            (eventService.getAllEvents as jest.Mock).mockResolvedValue(mockEvents);

            // Act
            await eventController.getAllEventsHandler(
                mockReq as Request, 
                mockRes as Response
            );

            // Assert
            expect(eventService.getAllEvents).toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Events retrieved",
                count: 2,
                data: mockEvents
            });
        });

        it("should handle errors when retrieving events fails", async () => {
            // Arrange
            const mockError = new Error("Database error");
            (eventService.getAllEvents as jest.Mock).mockRejectedValue(mockError);

            // Act
            await eventController.getAllEventsHandler(
                mockReq as Request, 
                mockRes as Response
            );

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.INTERNAL_SERVER_ERROR);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Failed to retrieve events"
            });
        });
    });

    describe("getEventByIdHandler", () => {
        it("should handle successful retrieval of an event by ID", async () => {
            // Arrange
            const mockEvent = { id: "evt_000001", name: "Conference 2024", capacity: 100 };
            mockReq.params = { id: "evt_000001" };
            (eventService.getEventById as jest.Mock).mockResolvedValue(mockEvent);

            // Act
            await eventController.getEventByIdHandler(
                mockReq as Request, 
                mockRes as Response
            );

            // Assert
            expect(eventService.getEventById).toHaveBeenCalledWith("evt_000001");
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Event retrieved",
                data: mockEvent
            });
        });

        it("should return 404 when event not found", async () => {
            // Arrange
            mockReq.params = { id: "evt_999999" };
            (eventService.getEventById as jest.Mock).mockResolvedValue(null);

            // Act
            await eventController.getEventByIdHandler(
                mockReq as Request, 
                mockRes as Response
            );

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.NOT_FOUND);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Event not found"
            });
        });
    });

    describe("createEventHandler", () => {
        it("should handle successful event creation", async () => {
            // Arrange
            const eventData = {
                name: "New Conference",
                date: "2024-12-25T10:00:00.000Z",
                capacity: 150
            };
            const createdEvent = { id: "evt_000003", ...eventData };
            
            mockReq.body = eventData;
            (eventService.createEvent as jest.Mock).mockResolvedValue(createdEvent);

            // Act
            await eventController.createEventHandler(
                mockReq as Request, 
                mockRes as Response
            );

            // Assert
            expect(eventService.createEvent).toHaveBeenCalledWith(eventData);
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Event created",
                data: createdEvent
            });
        });
    });

    describe("updateEventHandler", () => {
        it("should handle successful event update", async () => {
            // Arrange
            const eventId = "evt_000001";
            const updates = { name: "Updated Conference Name", capacity: 200 };
            const updatedEvent = { id: eventId, ...updates, date: "2024-12-25T10:00:00.000Z" };
            
            mockReq.params = { id: eventId };
            mockReq.body = updates;
            (eventService.updateEvent as jest.Mock).mockResolvedValue(updatedEvent);

            // Act
            await eventController.updateEventHandler(
                mockReq as Request, 
                mockRes as Response
            );

            // Assert
            expect(eventService.updateEvent).toHaveBeenCalledWith(eventId, updates);
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Event updated",
                data: updatedEvent
            });
        });

        it("should return 404 when updating non-existent event", async () => {
            // Arrange
            mockReq.params = { id: "evt_999999" };
            mockReq.body = { name: "Updated Name" };
            (eventService.updateEvent as jest.Mock).mockResolvedValue(null);

            // Act
            await eventController.updateEventHandler(
                mockReq as Request, 
                mockRes as Response
            );

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.NOT_FOUND);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Event not found"
            });
        });
    });

    describe("deleteEventHandler", () => {
        it("should handle successful event deletion", async () => {
            // Arrange
            mockReq.params = { id: "evt_000001" };
            (eventService.deleteEvent as jest.Mock).mockResolvedValue(true);

            // Act
            await eventController.deleteEventHandler(
                mockReq as Request, 
                mockRes as Response
            );

            // Assert
            expect(eventService.deleteEvent).toHaveBeenCalledWith("evt_000001");
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Event deleted"
            });
        });

        it("should return 404 when deleting non-existent event", async () => {
            // Arrange
            mockReq.params = { id: "evt_999999" };
            (eventService.deleteEvent as jest.Mock).mockResolvedValue(false);

            // Act
            await eventController.deleteEventHandler(
                mockReq as Request, 
                mockRes as Response
            );

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.NOT_FOUND);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Event not found"
            });
        });
    });
});