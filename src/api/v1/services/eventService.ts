import { Event, CreateEventRequest, UpdateEventRequest } from "../models/eventInterfaces";
import * as firestoreRepository from "../repositories/firestoreRepository";

const COLLECTION_NAME = "events";

let lastEventId = 0;

export const initializeLastEventId = async (): Promise<void> => {
    try {
        const snapshot = await firestoreRepository.getDocuments(COLLECTION_NAME);
        let maxNumericId = 0;
        
        snapshot.forEach((doc) => {
            const id = doc.id;
            if (id && id.startsWith('evt_')) {
                const numericPart = parseInt(id.replace('evt_', ''), 10);
                if (!isNaN(numericPart) && numericPart > maxNumericId) {
                    maxNumericId = numericPart;
                }
            }
        });
        
        lastEventId = maxNumericId;
        console.log(`Last event ID initialized to: ${lastEventId}`);
    } catch (error) {
        console.error("Failed to initialize lastEventId:", error);
        lastEventId = 0;
    }
};

const generateEventId = (): string => {
    lastEventId++;
    return `evt_${String(lastEventId).padStart(6, '0')}`;
};

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
        throw new Error("Failed to delete event");
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
    }

    catch (error) {
        throw new Error("Failed to delete event");
    }
};

export const createEvent = async (eventData: CreateEventRequest): Promise<Event> => {
    try {
        const now = new Date().toISOString();
        
        const newEvent = {
            name: eventData.name,
            date: eventData.date,
            capacity: eventData.capacity,
            registrationCount: eventData.registrationCount ?? 0,
            status: eventData.status ?? "active",
            category: eventData.category ?? "general",
            createdAt: now,
            updatedAt: now
        };
        
        const id = generateEventId();
        await firestoreRepository.createDocument(COLLECTION_NAME, newEvent, id);
        
        return {
            id,
            ...newEvent
        } as Event;
    }

    catch (error) {
        throw new Error("Failed to delete event");
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
    }
    
    catch (error) {
        throw new Error("Failed to delete event");
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
    }

    catch (error) {
        throw new Error("Failed to delete event");
    }
};