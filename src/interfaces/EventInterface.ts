// src/interfaces/EventInterface.ts

// Interface for customer registration request body
export interface RegisterRequestBody {
    username: string;
    password: string;
    mobile: string;
    email: string;
}

// Interface for customer data
export interface Customer {
    id: number;
    username: string;
    password: string;
    mobile: string;
    email: string;
    gender: string;
    // Add other customer fields as necessary
}

// Interface for customer data
export interface Event {
    id: number;
    title: string;
	description: string;
    date: string;
    location: string;
    startDate: string;
    endDate: string;
}

// Interface for rsvpModel data
export interface Rsv {
    id:number,
    userId:number;
    eventId:number;
    status: string;
}