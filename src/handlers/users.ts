import { Request, Response } from "express-serve-static-core";
import { CreateUserDto } from "../dtos/CreateUser.dto";
import { ErrorResponse } from "../types/response";
import { User } from '../interfaces/customerInterfaces';

import logger from "../utils/logger"; 
import { executeQuery } from '../services/dbServices';

export async function getUsers(request: Request, response: Response) {
    const requestId = response.locals.requestId; // Extract requestId from locals, assuming it's set earlier
    const gender = request.params.gender; // Extract gender from the URL parameter

    try {
        // Log the fetch attempt for customers by gender
        logger.info(`Request ${requestId}: Fetching customers by gender: ${gender}`);

        const rows = await executeQuery<User[]>("SELECT * FROM users", [gender]);

        logger.info(`Request ${requestId}: Total customers fetched by gender ${gender}: ${rows.length}`);

        if (rows.length === 0) {
            logger.warn(`Request ${requestId}: No customers found for gender ${gender}.`);
            return response.status(404).json({ message: `No customers found for gender ${gender}` });
        }

        logger.info(`Request ${requestId}: Successfully retrieved ${rows.length} customers for gender ${gender}.`);
        return response.status(200).json(rows); // Return the customers as JSON
    } catch (error) {
        // Log the error and return a response
        logger.error(`Request ${requestId}: Error fetching customers by gender: ${error instanceof Error ? error.message : 'Unknown error'}`);
        return response.status(500).json({ error: "Failed to fetch customers" });
    }
}

// Get user by ID
export async function getUserById(request: Request, response: Response) {
    const { id } = request.params;
    const requestId = response.locals.requestId;

    try {
        logger.info(`Request ${requestId}: Fetching user by ID: ${id}`);

        // Execute the query and explicitly type the result as an array of User
        const rows = await executeQuery<User[]>("SELECT * FROM users WHERE id = ?", [id]);

        // Now rows is always an array, so we can safely access rows.length
        if (rows.length > 0) {
            logger.info(`Request ${requestId}: User found with ID: ${id}`);
            return response.status(200).json(rows[0]); // Send the first user object
        } else {
            logger.warn(`Request ${requestId}: No user found with ID: ${id}`);
            return response.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        logger.error(`Request ${requestId}: Error fetching user by ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
        return response.status(500).json({ message: "Error fetching user from database" });
    }
}

// Create a new user
export async function createUser(
    request: Request<{}, {}, CreateUserDto>,
    response: Response<User | ErrorResponse>
) {
    const requestId = request.headers['x-request-id'] || 'unknown';

    logger.info(`Request ${requestId}: Incoming create user request. Username: ${request.body.username}, Email: ${request.body.email}`);

    if (!request.body) {
        logger.warn(`Request ${requestId}: Request body is missing`);
        return response.status(400).json({ error: 'Request body is missing' });
    }

    const {username, email } = request.body;

    if (!username || !email) {
        logger.warn(`Request ${requestId}: Missing username or email`);
        return response.status(400).json({ error: 'Missing username or email' });
    }

    try {
        logger.info(`Request ${requestId}: Inserting new user into database...`);

        // Execute the query without destructuring the result.
        const result = await executeQuery<{ insertId: number }>(
            `INSERT INTO users (username, email) VALUES (?, ?)`,
            [username, email]
        );

        const newUser: User = {
            id: result.insertId, // Use insertId from result directly
            username,
            email,
        };

        logger.info(`Request ${requestId}: User created successfully. User ID: ${newUser.id}, Username: ${newUser.username}, Email: ${newUser.email}`);

        return response.status(201).json(newUser);

    } catch (error) {
        logger.error(`Request ${requestId}: Error creating user. ${error instanceof Error ? error.message : 'Unknown error'}`);
        return response.status(500).json({ error: "Failed to create user" });
    }
}

// Delete user by ID
export async function deleteUserById(request: Request, response: Response) {
    const { id } = request.params;
    const requestId = response.locals.requestId;

    try {
        logger.info(`Request ${requestId}: Deleting user with ID: ${id}`);

        // No need to destructure here since the result is an object, not an array
        const result = await executeQuery<{ affectedRows: number }>("DELETE FROM users WHERE id = ?", [id]);

        // result will now be an object, so we can directly check `affectedRows`
        if (result.affectedRows > 0) {
            logger.info(`Request ${requestId}: User with ID ${id} deleted successfully`);
            return response.status(200).json({ message: `User with ID ${id} deleted successfully` });
        } else {
            logger.warn(`Request ${requestId}: No user found with ID: ${id}`);
            return response.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        logger.error(`Request ${requestId}: Error deleting user by ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
        return response.status(500).json({ message: "Error deleting user from database" });
    }
}

// Update user by ID
export async function updateUserById(request: Request, response: Response) {
    const { id } = request.params;
    const { username, email } = request.body;
    const requestId = response.locals.requestId;

    if (!username || !email) {
        return response.status(400).json({ message: 'Username and email are required' });
    }

    try {
        logger.info(`Request ${requestId}: Updating user with ID: ${id}, Username: ${username}, Email: ${email}`);

        // No destructuring because the result is not an array, but an object
        const result = await executeQuery<{ affectedRows: number }>(
            'UPDATE users SET username = ?, email = ? WHERE id = ?',
            [username, email, id]
        );

        // Access the affectedRows directly
        if (result.affectedRows > 0) {
            logger.info(`Request ${requestId}: User with ID ${id} updated successfully`);
            return response.status(200).json({ message: `User with ID ${id} updated successfully` });
        } else {
            logger.warn(`Request ${requestId}: No user found with ID: ${id}`);
            return response.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        logger.error(`Request ${requestId}: Error updating user: ${error instanceof Error ? error.message : 'Unknown error'}`);
        return response.status(500).json({ message: "Error updating user in database" });
    }
}
