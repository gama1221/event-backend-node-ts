import { Router } from "express";
import { getRsv, getRsvById, createRsv, getRsvpStatus, getEventRsvps } from "../handlers/rsv";

const router = Router();

/**
 * @openapi
 * /api/rsv:
 *   get:
 *     summary: Get a list of all events
 *     description: Fetch all event from the database.
 *     tags:
 *       - Rsvs
 *     responses:
 *       200:
 *         description: A list of rsvs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Rsv'
 *       500:
 *         description: Internal server error
 */
router.get("/", getRsv);

/**
 * @openapi
 * /api/rsv/{id}:
 *   get:
 *     summary: Get rsv by ID
 *     description: Fetch a specific rsv by their unique ID.
 *     tags:
 *       - Rsvs
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
router.get("/:id", getRsvById);
/**
 * @openapi
 * /api/rsv/event/{eventId}:
 *   get:
 *     summary: Get event by ID
 *     description: Fetch a specific event by their unique ID.
 *     tags:
 *       - Rsvs
 *     parameters:
 *       - in: path
 *         name: eventId
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
router.get("/event/:eventId", getEventRsvps);
/**
 * @openapi
 * /api/rsv/user{id}/event{eventId}:
 *   get:
 *     summary: Get rsv by event ID
 *     description: Fetch a specific event by their unique ID.
 *     tags:
 *       - Rsvs
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
router.get("/user/:userId/event/:eventId", getRsvpStatus);

/**
 * @openapi
 * /api/rsv:
 *   post:
 *     summary: Create a new rsv
 *     description: Add a new rsv to the system.
 *     tags:
 *       - Rsvs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Rsv'
 *     responses:
 *       201:
 *         description: The created rsv
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/rsv'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
router.post("/", createRsv);

export default router;
