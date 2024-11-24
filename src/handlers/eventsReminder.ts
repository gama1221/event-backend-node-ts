import { Request, Response } from "express-serve-static-core";
import { CreateEventDto } from "../dtos/CreateEventDto";
import { ErrorResponse } from "../types/response";
import { Event } from '../interfaces/EventInterface';

import logger from "../utils/logger"; 
import { executeQuery } from '../services/dbServices';

export async function getEvents(request: Request, response: Response) {
    const requestId = response.locals.requestId; // Extract requestId from locals, assuming it's set earlier
    const gender = request.params.gender; // Extract gender from the URL parameter

    try {
        // Log the fetch attempt for customers by gender
        logger.info(`Request ${requestId}: Fetching events`);

        const rows = await executeQuery<Event[]>("SELECT * FROM events", [gender]);

        logger.info(`Request ${requestId}: Total events fetched : ${rows.length}`);

        if (rows.length === 0) {
            logger.warn(`Request ${requestId}: No events found .`);
            return response.status(404).json({ message: `No events found` });
        }

        logger.info(`Request ${requestId}: Successfully retrieved ${rows.length} events.`);
        return response.status(200).json(rows); // Return the customers as JSON
    } catch (error) {
        // Log the error and return a response
        logger.error(`Request ${requestId}: Error fetching events ${error instanceof Error ? error.message : 'Unknown error'}`);
        return response.status(500).json({ error: "Failed to fetch events" });
    }
}

// Get user by ID
export async function getEventById(request: Request, response: Response) {
    const { id } = request.params;
    const requestId = response.locals.requestId;

    try {
        logger.info(`Request ${requestId}: Fetching event by ID: ${id}`);

        // Execute the query and explicitly type the result as an array of User
        const rows = await executeQuery<Event[]>("SELECT * FROM events WHERE id = ?", [id]);

        // Now rows is always an array, so we can safely access rows.length
        if (rows.length > 0) {
            logger.info(`Request ${requestId}: Event found with ID: ${id}`);
            return response.status(200).json(rows[0]); // Send the first user object
        } else {
            logger.warn(`Request ${requestId}: No user found with ID: ${id}`);
            return response.status(404).json({ message: "Event not found" });
        }
    } catch (error) {
        logger.error(`Request ${requestId}: Error fetching event by ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
        return response.status(500).json({ message: "Error fetching event from database" });
    }
}

// Create a new user
export async function createEvent(
    request: Request<{}, {}, CreateEventDto>,
    response: Response<Event | ErrorResponse>
) {
    const requestId = request.headers['x-request-id'] || 'unknown';

    logger.info(`Request ${requestId}: Incoming create event request. Titl: ${request.body.title}, Location: ${request.body.location}`);

    if (!request.body) {
        logger.warn(`Request ${requestId}: Request body is missing`);
        return response.status(400).json({ error: 'Request body is missing' });
    }

    const {title, description, date, location, startDate, endDate } = request.body;

    if (!title || !description || !date || !location) {
        logger.warn(`Request ${requestId}: Missing title, description, date, or location`);
        return response.status(400).json({ error: 'title, description, date, or location' });
    }

    try {
        logger.info(`Request ${requestId}: Inserting new event into database...`);

        // Execute the query without destructuring the result.
        const result = await executeQuery<{ insertId: number }>(
            `INSERT INTO events (title, description, date, location) VALUES (?,?,?, ?)`,
            [title, description, date, location]
        );

        const newEvent: Event = {
            id: result.insertId, // Use insertId from result directly
            title,
            description,
            date,
            location,
            startDate,
            endDate,
        };

        logger.info(`Request ${requestId}: Event created successfully. Event ID: ${newEvent.id}, title: ${newEvent.title}, description: ${newEvent.description}`);

        return response.status(201).json(newEvent);

    } catch (error) {
        logger.error(`Request ${requestId}: Error creating event. ${error instanceof Error ? error.message : 'Unknown error'}`);
        return response.status(500).json({ error: "Failed to create event" });
    }
}

//event Registration
export async function eventRegistration(
    request: Request<{}, {}, CreateEventDto>,
    response: Response<Event | ErrorResponse>
) {
    // const { id } = request.params;
    const requestId = request.headers['x-request-id'] || 'unknown';

    logger.info(`Request ${requestId}: Incoming create event request. Titl: ${request.body.title}, Location: ${request.body.location}`);

    if (!request.body) {
        logger.warn(`Request ${requestId}: Request body is missing`);
        return response.status(400).json({ error: 'Request body is missing' });
    }

    const {title, description, date, location, startDate, endDate} = request.body;

    if (!title || !description || !date || !location) {
        logger.warn(`Request ${requestId}: Missing title, description, date, or location`);
        return response.status(400).json({ error: 'title, description, date, or location' });
    }

    try {
        logger.info(`Request ${requestId}: Inserting new event into database...`);

        // Execute the query without destructuring the result.
        const result = await executeQuery<{ insertId: number }>(
            `INSERT INTO events (title, description, date, location) VALUES (?,?,?, ?)`,
            [title, description, date, location]
        );

        const newEvent: Event = {
            id: result.insertId, // Use insertId from result directly
            title,
            description,
            date,
            location,
            startDate,
            endDate,
        };

        logger.info(`Request ${requestId}: Event created successfully. Event ID: ${newEvent.id}, title: ${newEvent.title}, description: ${newEvent.description}`);

        return response.status(201).json(newEvent);

    } catch (error) {
        logger.error(`Request ${requestId}: Error creating event. ${error instanceof Error ? error.message : 'Unknown error'}`);
        return response.status(500).json({ error: "Failed to create event" });
    }
}
// Delete user by ID
export async function deleteEventById(request: Request, response: Response) {
    const { id } = request.params;
    const requestId = response.locals.requestId;

    try {
        logger.info(`Request ${requestId}: Deleting event with ID: ${id}`);

        // No need to destructure here since the result is an object, not an array
        const result = await executeQuery<{ affectedRows: number }>("DELETE FROM events WHERE id = ?", [id]);

        // result will now be an object, so we can directly check `affectedRows`
        if (result.affectedRows > 0) {
            logger.info(`Request ${requestId}: Event with ID ${id} deleted successfully`);
            return response.status(200).json({ message: `Event with ID ${id} deleted successfully` });
        } else {
            logger.warn(`Request ${requestId}: No event found with ID: ${id}`);
            return response.status(404).json({ message: "Event not found" });
        }
    } catch (error) {
        logger.error(`Request ${requestId}: Error deleting event by ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
        return response.status(500).json({ message: "Error deleting event from database" });
    }
}

// Update user by ID
export async function updateEventById(request: Request, response: Response) {
    const { id } = request.params;
    const {title, description, date, location } = request.body;
    const requestId = response.locals.requestId;

    if (!title || !description || !date || !location) {
        return response.status(400).json({ message: 'title, description, date and location are required' });
    }

    try {
        logger.info(`Request ${requestId}: Updating event with ID: ${id}, title: ${title}, description: ${description}, date: ${date}, location: ${location}`);

        // No destructuring because the result is not an array, but an object
        const result = await executeQuery<{ affectedRows: number }>(
            'UPDATE events SET title = ?, description = ?, date = ?,location = ? WHERE id = ?',
            [title, description, date, location, id]
        );

        // Access the affectedRows directly
        if (result.affectedRows > 0) {
            logger.info(`Request ${requestId}: Event with ID ${id} updated successfully`);
            return response.status(200).json({ message: `Event with ID ${id} updated successfully` });
        } else {
            logger.warn(`Request ${requestId}: No event found with ID: ${id}`);
            return response.status(404).json({ message: "Event not found" });
        }
    } catch (error) {
        logger.error(`Request ${requestId}: Error updating event: ${error instanceof Error ? error.message : 'Unknown error'}`);
        return response.status(500).json({ message: "Error updating event in database" });
    }
}
