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