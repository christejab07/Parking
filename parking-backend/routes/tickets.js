// routes/tickets.js
const express = require('express');
const router = express.Router();
const ticketController = require('../controller/ticketController');
const { authenticate } = require('../middleware/auth');

/**
 * @swagger
 * /api/tickets:
 *   get:
 *     summary: Get all tickets for authenticated user
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tickets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   startTime:
 *                     type: string
 *                     format: date-time
 *                   endTime:
 *                     type: string
 *                     format: date-time
 *                   status:
 *                     type: string
 *                     enum: [paid, unpaid]
 *       400:
 *         description: Bad request
 */
router.get('/', authenticate, ticketController.getTickets);

/**
 * @swagger
 * /api/tickets/{id}/pay:
 *   put:
 *     summary: Pay a ticket
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Ticket paid successfully
 *       404:
 *         description: Ticket not found
 */
router.put('/:id/pay', authenticate, ticketController.payTicket);

module.exports = router;