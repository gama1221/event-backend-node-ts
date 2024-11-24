import { Router } from "express";
import { getUsers, getUserById,deleteUserById, createUser, updateUserById } from "../handlers/users";

const router = Router();

/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: Get a list of all users
 *     description: Fetch all users from the database.
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error
 */
router.get("/", getUsers);

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: Fetch a specific user by their unique ID.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to fetch.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A user object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", getUserById);
/**
 * @openapi
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     description: Remove a user from the system by their unique ID.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A confirmation of deletion
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", deleteUserById);
/**
 * @openapi
 * /api/users/{id}:
 *   put:
 *     summary: Update a user's information
 *     description: Update the details of an existing user by their ID.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The updated user object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", updateUserById);

/**
 * @openapi
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     description: Add a new user to the system.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: The created user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
router.post("/", createUser);

export default router;
