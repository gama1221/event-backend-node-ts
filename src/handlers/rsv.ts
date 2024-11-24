import { Request, Response } from "express-serve-static-core";
import { RsvDto } from "../dtos/RsvDto";
import { ErrorResponse } from "../types/response";
import { Rsv } from '../interfaces/EventInterface';

import logger from "../utils/logger"; 
import { executeQuery } from '../services/dbServices';

export async function getRsv(request: Request, response: Response) {
    const requestId = response.locals.requestId; // Extract requestId from locals, assuming it's set earlier

    try {
        // Log the fetch attempt for customers by gender
        logger.info(`Request ${requestId}: Fetching rsv`);

        const rows = await executeQuery<Rsv[]>("SELECT * FROM rsvps", []);

        logger.info(`Request ${requestId}: Total rsv fetched : ${rows.length}`);

        if (rows.length === 0) {
            logger.warn(`Request ${requestId}: No rsv found .`);
            return response.status(404).json({ message: `No rsv found` });
        }

        logger.info(`Request ${requestId}: Successfully retrieved ${rows.length} rsv.`);
        return response.status(200).json(rows); // Return the customers as JSON
    } catch (error) {
        // Log the error and return a response
        logger.error(`Request ${requestId}: Error fetching rsv ${error instanceof Error ? error.message : 'Unknown error'}`);
        return response.status(500).json({ error: "Failed to fetch rsv" });
    }
}

// Get user by ID
export async function getRsvById(request: Request, response: Response) {
    const { id } = request.params;
    const requestId = response.locals.requestId;

    try {
        logger.info(`Request ${requestId}: Fetching rsv by ID: ${id}`);

        // Execute the query and explicitly type the result as an array of User
        const rows = await executeQuery<Rsv[]>("SELECT * FROM rsvps WHERE id = ?", [id]);

        // Now rows is always an array, so we can safely access rows.length
        if (rows.length > 0) {
            logger.info(`Request ${requestId}: rsv found with ID: ${id}`);
            return response.status(200).json(rows[0]); // Send the first user object
        } else {
            logger.warn(`Request ${requestId}: No user found with ID: ${id}`);
            return response.status(404).json({ message: "rsv not found" });
        }
    } catch (error) {
        logger.error(`Request ${requestId}: Error fetching rsv by ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
        return response.status(500).json({ message: "Error fetching rsv from database" });
    }
}

// Create a new user
export async function createRsv(
    request: Request<{}, {}, RsvDto>,
    response: Response<Rsv | ErrorResponse>
) {
    const requestId = request.headers['x-request-id'] || 'unknown';

    logger.info(`Request ${requestId}: Incoming create rsv request. UserId: ${request.body.userId}, EventId: ${request.body.eventId}, , Status: ${request.body.status}`);

    if (!request.body) {
        logger.warn(`Request ${requestId}: Request body is missing`);
        return response.status(400).json({ error: 'Request body is missing' });
    }

    const {userId, eventId, status } = request.body;

    if (!userId || !eventId || !status) {
        logger.warn(`Request ${requestId}: Missing eventId, eventId, or status`);
        return response.status(400).json({ error: 'userId, eventId, or status' });
    }

    try {
        logger.info(`Request ${requestId}: Inserting new rsv into database...`);

        // Execute the query without destructuring the result.
        const result = await executeQuery<{ insertId: number }>(
            `INSERT INTO rsvps (user_id, event_id, status) 
            VALUES (?, ?, ?)`,
            [userId, eventId, status]
        );

        const newRsv: Rsv = {
            id: result.insertId, // Use insertId from result directly
            userId,
            eventId,
            status,
        };

        logger.info(`Request ${requestId}: Rsv created successfully. Event ID: ${newRsv.id}, UserId: ${newRsv.userId}, EventId: ${newRsv.eventId}`);

        return response.status(201).json(newRsv);

    } catch (error) {
        logger.error(`Request ${requestId}: Error creating rsv. ${error instanceof Error ? error.message : 'Unknown error'}`);
        return response.status(500).json({ error: "Failed to create rsv" });
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
export const getRsvpStatus = async (request: Request, response: Response) => {
    const { userId, eventId } = request.params; // Extract parameters from the request
    const requestId = response.locals.requestId; // Assuming this is being set somewhere in your middleware
  
    // Validate if userId and eventId are provided
    if (!userId || !eventId) {
      return response.status(400).json({ message: 'userId and eventId are required' });
    }
  
    try {
      logger.info(`Request ${requestId}: Fetching RSVP status for user ID: ${userId}, event ID: ${eventId}`);
  
      // Execute the query to fetch the RSVP status
      const rows = await executeQuery<Rsv[]>(
        'SELECT status FROM rsvps WHERE user_id = ? AND event_id = ?',
        [userId, eventId]
      );
  
      // If the rows contain data, return the status; otherwise, return null
      if (rows.length > 0) {
        logger.info(`Request ${requestId}: RSVP status found for user ID: ${userId}, event ID: ${eventId}`);
        return response.status(200).json({ status: rows[0].status });
      } else {
        logger.warn(`Request ${requestId}: No RSVP found for user ID: ${userId}, event ID: ${eventId}`);
        return response.status(404).json({ message: 'RSVP not found' });
      }
    } catch (error) {
      logger.error(`Request ${requestId}: Error fetching RSVP status: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return response.status(500).json({ message: 'Error fetching RSVP status from the database' });
    }
  };

//   export const getEventRsvps = async (request: Request, response: Response) => {
//     const { eventId } = request.params; // Extract eventId from request parameters
//     const requestId = response.locals.requestId; // Assuming the requestId is set somewhere in the middleware
  
//     // Validate if eventId is provided
//     if (!eventId) {
//       return response.status(400).json({ message: 'eventId is required' });
//     }
  
//     try {
//       logger.info(`Request ${requestId}: Fetching RSVPs for event ID: ${eventId}`);
  
//       // Execute the query to fetch the RSVPs for the event
//       const rows = await executeQuery<{ username: string, status: string }[]>(
//         'SELECT users.username, rsvps.status FROM rsvps JOIN users ON rsvps.user_id = users.id WHERE rsvps.event_id = ?',
//         [eventId]
//       );
  
//       // If the rows contain data, return the RSVPs; otherwise, return an empty array
//       if (rows.length > 0) {
//         logger.info(`Request ${requestId}: RSVPs found for event ID: ${eventId}`);
//         return response.status(200).json({ rsvps: rows });
//       } else {
//         logger.warn(`Request ${requestId}: No RSVPs found for event ID: ${eventId}`);
//         return response.status(404).json({ message: 'No RSVPs found for this event' });
//       }
//     } catch (error) {
//       logger.error(`Request ${requestId}: Error fetching RSVPs for event ID: ${eventId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
//       return response.status(500).json({ message: 'Error fetching RSVPs from the database' });
//     }
//   };
export const getEventRsvps = async (request: Request, response: Response) => {
    const { eventId } = request.params;  // Extract eventId from URL path
    const requestId = response.locals.requestId;  // Assuming requestId is set somewhere in middleware

    // Validate if eventId is provided
    if (!eventId) {
        return response.status(400).json({ message: 'eventId is required' });
    }

    try {
        logger.info(`Request ${requestId}: Fetching RSVPs for event ID: ${eventId}`);

        // Check if eventId is numeric or alphanumeric
        const isNumeric = !isNaN(Number(eventId));  // Check if eventId is a number
        let query;

        // Depending on whether eventId is numeric or alphanumeric, use appropriate query
        if (isNumeric) {
            // If eventId is numeric (e.g., '1', '2', etc.), execute this query
            query = 'SELECT users.username, rsvps.status FROM rsvps JOIN users ON rsvps.user_id = users.id WHERE rsvps.event_id = ?';
        } else {
            // If eventId is alphanumeric (e.g., 'event1', 'event2', etc.), execute this query
            query = 'SELECT users.username, rsvps.status FROM rsvps JOIN users ON rsvps.user_id = users.id WHERE rsvps.event_id = ?';
        }

        // Execute the query with the eventId parameter
        const rows = await executeQuery<{ username: string, status: string }[]>(
            query,
            [eventId]  // Pass eventId to the query
        );

        if (rows.length > 0) {
            logger.info(`Request ${requestId}: RSVPs found for event ID: ${eventId}`);
            return response.status(200).json({ rsvps: rows });
        } else {
            logger.warn(`Request ${requestId}: No RSVPs found for event ID: ${eventId}`);
            return response.status(404).json({ message: 'No RSVPs found for this event' });
        }
    } catch (error) {
        logger.error(`Request ${requestId}: Error fetching RSVPs for event ID: ${eventId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        return response.status(500).json({ message: 'Error fetching RSVPs from the database' });
    }
};

