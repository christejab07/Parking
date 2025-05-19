// controllers/ticketController.js
const { Ticket, Booking, Vehicle } = require('../models');

const getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.findAll({
      include: [
        {
          model: Vehicle,
          where: { userId: req.user.id }
        }
      ]
    });
    res.json(tickets);
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: error.message });
  }
};

const payTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByPk(req.params.id, {
      include: [{
        model: Vehicle,
        where: { userId: req.user.id }
      }]
    });

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    ticket.status = 'paid';
    await ticket.save();
    res.json(ticket);
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getTickets, payTicket };