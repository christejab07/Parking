// controllers/bookingController.js
const { Booking, Vehicle, Ticket } = require("../models");

const createBooking = async (req, res) => {
  try {
    const { vehicleId, startTime, endTime } = req.body;

    const vehicle = await Vehicle.findOne({
      where: { id: vehicleId, userId: req.user.id },
    });

    if (!vehicle) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    const booking = await Booking.create({
      vehicleId,
      startTime,
      endTime,
      status: "pending",
    });

    res.status(201).json(booking);
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: error.message });
  }
};

const approveBooking = async (req, res) => {
  try {
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
    console.log(error)
    res.status(400).json({ error: error.message });
  }
};

module.exports = { createBooking, approveBooking };
