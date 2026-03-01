import { Event, CreateEventRequest, UpdateEventRequest } from "../models/eventInterfaces";
import * as firestoreRepository from "../repositories/firestoreRepository";

const COLLECTION_NAME = "events";

export const getAllEvents = async (): Promise<Event[]> => {
    try {
        const snapshot = await firestoreRepository.getDocuments(COLLECTION_NAME);
        const events: Event[] = [];
        
        snapshot.forEach((doc) => {
            const data = doc.data();
            events.push({
                id: doc.id,
                ...data
            } as Event);
        });
        
        return events;
    } 
    
    catch (error) {
        throw new Error(`Failed to fetch events: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
};

export const getEventById = async (id: string): Promise<Event | null> => {
    try {
        const doc = await firestoreRepository.getDocumentById(COLLECTION_NAME, id);
        
        if (!doc) {
            return null;
        }
        
        const data = doc.data();
        return {
            id: doc.id,
            ...data
        } as Event;
    } catch (error) {
        throw new Error(`Failed to fetch event: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
};

export const createEvent = async (eventData: CreateEventRequest): Promise<Event> => {
    try {
        const now = new Date().toISOString();
        const newEvent = {
            ...eventData,
            status: "active",
            createdAt: now,
            updatedAt: now
        };
        
        const id = await firestoreRepository.createDocument(COLLECTION_NAME, newEvent);
        
        return {
            id,
            ...newEvent
        } as Event;
    } catch (error) {
        throw new Error(`Failed to create event: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
};

export const updateEvent = async (id: string, updates: UpdateEventRequest): Promise<Event | null> => {
    try {
        const existingEvent = await getEventById(id);
        
        if (!existingEvent) {
            return null;
        }
        
        const updatedData = {
            ...updates,
            updatedAt: new Date().toISOString()
        };
        
        await firestoreRepository.updateDocument(COLLECTION_NAME, id, updatedData);
        
        const updatedEvent = await getEventById(id);
        return updatedEvent;
    } catch (error) {
        throw new Error(`Failed to update event: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
};

export const deleteEvent = async (id: string): Promise<boolean> => {
    try {
        const existingEvent = await getEventById(id);
        
        if (!existingEvent) {
            return false;
        }
        
        await firestoreRepository.deleteDocument(COLLECTION_NAME, id);
        return true;
    } catch (error) {
        throw new Error(`Failed to delete event: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
};