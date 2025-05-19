// models/Ticket.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Ticket = sequelize.define('Ticket', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('paid', 'unpaid'),
      allowNull: false,
      defaultValue: 'unpaid'
    }
  },
  {
    timestamps: false 
  });
  return Ticket;
};