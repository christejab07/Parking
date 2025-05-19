const { Ticket, Vehicle } = require('../models');

const validateId = (id) => /^\d+$/.test(id);

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
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

const payTicket = async (req, res) => {
  try {
    if (!validateId(req.params.id)) {
      return res.status(400).json({ error: 'Ticket ID must be a positive integer' });
    }

    const ticket = await Ticket.findByPk(req.params.id, {
      include: [{
        model: Vehicle,
        where: { userId: req.user.id }
      }]
    });

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found or not owned by user' });
    }

    ticket.status = 'paid';
    await ticket.save();
    res.json(ticket);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getTickets, payTicket };