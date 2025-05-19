// models/index.js
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql'
  }
);

// Load models
const User = require('./User')(sequelize);
const Vehicle = require('./Vehicle')(sequelize);
const Booking = require('./Booking')(sequelize);
const Ticket = require('./Ticket')(sequelize);

// Verify models are defined
if (!User || !Vehicle || !Booking || !Ticket) {
  throw new Error('One or more models failed to load. Check model files.');
}

// Associations
User.hasMany(Vehicle, { foreignKey: 'userId' });
Vehicle.belongsTo(User, { foreignKey: 'userId' });

Vehicle.hasMany(Booking, { foreignKey: 'vehicleId' });
Booking.belongsTo(Vehicle, { foreignKey: 'vehicleId' });

Booking.hasOne(Ticket, { foreignKey: 'bookingId' });
Ticket.belongsTo(Booking, { foreignKey: 'bookingId' });

Ticket.belongsTo(Vehicle, { foreignKey: 'vehicleId' });

module.exports = {
  sequelize,
  User,
  Vehicle,
  Booking,
  Ticket
};
