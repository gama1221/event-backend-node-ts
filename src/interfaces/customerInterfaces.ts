// src/interfaces/customerInterfaces.ts

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
export interface User {
    id: number;
    username: string;
    email: string;
    // Add other customer fields as necessary
}
