import { Request, Response } from "express";
import * as eventService from "../services/eventService";
import { HTTP_STATUS } from "../../../constants/httpConstants";

export const getAllEventsHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const events = await eventService.getAllEvents();
        
        res.status(HTTP_STATUS.OK).json({
            message: "Events retrieved",
            count: events.length,
            data: events
        });
    }
    
    catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: "Failed to retrieve events"
        });
    }
};

export const getEventByIdHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        
        const event = await eventService.getEventById(id);
        
        if (!event) {
            res.status(HTTP_STATUS.NOT_FOUND).json({
                message: "Event not found"
            });
            return;
        }
        
        res.status(HTTP_STATUS.OK).json({
            message: "Event retrieved",
            data: event
        });
    }
    
    catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: "Failed to retrieve event"
        });
    }
};

export const createEventHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const eventData = req.body;
        
        const newEvent = await eventService.createEvent(eventData);
        
        res.status(HTTP_STATUS.CREATED).json({
            message: "Event created",
            data: newEvent
        });
    }
    
    catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: "Failed to create event"
        });
    }
};

export const updateEventHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        const updatedEvent = await eventService.updateEvent(id, updates);
        
        if (!updatedEvent) {
            res.status(HTTP_STATUS.NOT_FOUND).json({
                message: "Event not found"
            });
            return;
        }
        
        res.status(HTTP_STATUS.OK).json({
            message: "Event updated",
            data: updatedEvent
        });
    }
    
    catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: "Failed to update event"
        });
    }
};

export const deleteEventHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        
        const deleted = await eventService.deleteEvent(id);
        
        if (!deleted) {
            res.status(HTTP_STATUS.NOT_FOUND).json({
                message: "Event not found"
            });
            return;
        }
        
        res.status(HTTP_STATUS.OK).json({
            message: "Event deleted"
        });
    }
    
    catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: "Failed to delete event"
        });
    }
};