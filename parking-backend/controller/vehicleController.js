// controllers/vehicleController.js
const { Vehicle } = require('../models');

const createVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.create({
      ...req.body,
      userId: req.user.id
    });
    res.status(201).json(
        {message: vehicle.plateNumber + " created successfully"}
    );
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.log(error)
  }
};

const getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.findAll({
      where: { userId: req.user.id }
    });
    res.json(vehicles);
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.log(error)
  }
};

const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found or not owned by user' });
    }

    await vehicle.update(req.body);
    res.json(vehicle);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found or not owned by user' });
    }

    await vehicle.destroy();
    res.json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { createVehicle, getVehicles, updateVehicle, deleteVehicle };