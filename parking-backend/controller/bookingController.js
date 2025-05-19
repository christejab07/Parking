const { Booking, Vehicle } = require("../models");

const validateVehicleId = (vehicleId) => /^\d+$/.test(vehicleId);
const validateDateTime = (dateTime) => !isNaN(Date.parse(dateTime));

const createBooking = async (req, res) => {
  try {
    const { vehicleId, startTime, endTime } = req.body;

    // Input validation
    if (!validateVehicleId(vehicleId)) {
      return res
        .status(400)
        .json({ error: "Vehicle ID must be a positive integer" });
    }
    if (!validateDateTime(startTime) || !validateDateTime(endTime)) {
      return res
        .status(400)
        .json({
          error: "Start and end times must be valid ISO 8601 date-times",
        });
    }
    const start = new Date(startTime);
    const end = new Date(endTime);
    if (end <= start) {
      return res
        .status(400)
        .json({ error: "End time must be after start time" });
    }

    const vehicle = await Vehicle.findOne({
      where: { id: vehicleId, userId: req.user.id },
    });

    if (!vehicle) {
      return res
        .status(404)
        .json({ error: "Vehicle not found or not owned by user" });
    }

    const booking = await Booking.create({
      vehicleId,
      startTime,
      endTime,
      status: "pending",
    });

    res.status(201).json(booking);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

const approveBooking = async (req, res) => {
  try {
    if (!/^\d+$/.test(req.params.id)) {
      return res
        .status(400)
        .json({ error: "Booking ID must be a positive integer" });
    }

    const booking = await Booking.findByPk(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    booking.status = "approved";
    await booking.save();

    // Create ticket when booking is approved
    await Ticket.create({
      bookingId: booking.id,
      vehicleId: booking.vehicleId,
      startTime: booking.startTime,
      endTime: booking.endTime,
      status: "unpaid",
    });

    res.json(booking);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = { createBooking, approveBooking };
