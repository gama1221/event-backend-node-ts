import { Router } from "express";
import { getEvents, getEventById,deleteEventById, createEvent, updateEventById, eventRegistration } from "../handlers/events";

const router = Router();

/**
 * @openapi
 * /api/event:
 *   get:
 *     summary: Get a list of all events
 *     description: Fetch all event from the database.
 *     tags:
 *       - Events
 *     responses:
 *       200:
 *         description: A list of events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       500:
 *         description: Internal server error
 */
router.get("/", getEvents);

/**
 * @openapi
 * /api/event/{id}:
 *   get:
 *     summary: Get event by ID
 *     description: Fetch a specific event by their unique ID.
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the event to fetch.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A event object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", getEventById);
/**
 * @openapi
 * /api/event/{id}:
 *   delete:
 *     summary: Delete a event by ID
 *     description: Remove a event from the system by their unique ID.
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the event to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A confirmation of deletion
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", deleteEventById);
/**
 * @openapi
 * /api/event/{id}:
 *   put:
 *     summary: Update a event's information
 *     description: Update the details of an existing event by their ID.
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the event to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       200:
 *         description: The updated event object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", updateEventById);

/**
 * @openapi
 * /api/event:
 *   post:
 *     summary: Create a new event
 *     description: Add a new event to the system.
 *     tags:
 *       - Events
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       201:
 *         description: The created event
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
router.post("/", createEvent);
/**
 * @openapi
 * /api/event:
 *   post:
 *     summary: Create a new event
 *     description: Add a new event to the system.
 *     tags:
 *       - Events
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       201:
 *         description: The created event
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
router.post("/:id/rsvp", eventRegistration);

export default router;
