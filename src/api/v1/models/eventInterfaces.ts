export interface Event {
    id: string;
    name: string;
    date: string;
    capacity: number;
    registrationCount: number;
    status: 'active' | 'cancelled' | 'completed';
    category: 'conference' | 'workshop' | 'meetup' | 'seminar' | 'general';
    createdAt: string;
    updatedAt: string;
}

export interface CreateEventRequest {
    name: string;
    date: string;
    capacity: number;
    registrationCount?: number;
    status?: 'active' | 'cancelled' | 'completed';
    category?: 'conference' | 'workshop' | 'meetup' | 'seminar' | 'general';
}