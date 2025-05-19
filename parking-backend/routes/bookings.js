// routes/bookings.js
const express = require('express');
const router = express.Router();
const bookingController = require('../controller/bookingController');
const { authenticate, isAdmin } = require('../middleware/auth');

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Create a new booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - vehicleId
 *               - startTime
 *               - endTime
 *             properties:
 *               vehicleId:
 *                 type: integer
 *               startTime:
 *                 type: string
 *                 format: date-time
 *               endTime:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Vehicle not found
 */
router.post('/', authenticate, bookingController.createBooking);

/**
 * @swagger
 * /api/bookings/{id}/approve:
 *   put:
 *     summary: Approve a booking (Admin only)
 *     tags: [Bookings]
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
 *         description: Booking approved successfully
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Booking not found
 */
router.put('/:id/approve', authenticate, isAdmin, bookingController.approveBooking);

module.exports = router;