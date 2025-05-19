const { Vehicle } = require('../models');

const validatePlateNumber = (plateNumber) => /^[\w\s-]{3,10}$/.test(plateNumber);
const validateBrand = (brand) => /^[a-zA-Z\s]{2,50}$/.test(brand);
const validateModel = (model) => /^[a-zA-Z0-9\s]{2,50}$/.test(model);
const validateColor = (color) => /^[a-zA-Z\s]{2,50}$/.test(color);

const createVehicle = async (req, res) => {
  try {
    const { plateNumber, brand, model, color } = req.body;

    // Input validation
    if (!validatePlateNumber(plateNumber)) {
      return res.status(400).json({ error: 'Plate number must be 3-10 characters, alphanumeric with hyphens/spaces' });
    }
    if (!validateBrand(brand)) {
      return res.status(400).json({ error: 'Brand must be 2-50 characters, letters and spaces only' });
    }
    if (!validateModel(model)) {
      return res.status(400).json({ error: 'Model must be 2-50 characters, alphanumeric and spaces only' });
    }
    if (!validateColor(color)) {
      return res.status(400).json({ error: 'Color must be 2-50 characters, letters and spaces only' });
    }

    const vehicle = await Vehicle.create({
      plateNumber,
      brand,
      model,
      color,
      userId: req.user.id
    });
    res.status(201).json(vehicle);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

const getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.findAll({
      where: { userId: req.user.id }
    });
    res.json(vehicles);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

const updateVehicle = async (req, res) => {
  try {
    const { plateNumber, brand, model, color } = req.body;

    // Input validation (only for provided fields)
    if (plateNumber && !validatePlateNumber(plateNumber)) {
      return res.status(400).json({ error: 'Plate number must be 3-10 characters, alphanumeric with hyphens/spaces' });
    }
    if (brand && !validateBrand(brand)) {
      return res.status(400).json({ error: 'Brand must be 2-50 characters, letters and spaces only' });
    }
    if (model && !validateModel(model)) {
      return res.status(400).json({ error: 'Model must be 2-50 characters, alphanumeric and spaces only' });
    }
    if (color && !validateColor(color)) {
      return res.status(400).json({ error: 'Color must be 2-50 characters, letters and spaces only' });
    }

    const vehicle = await Vehicle.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found or not owned by user' });
    }

    await vehicle.update(req.body);
    res.json(vehicle);
  } catch (error) {
    console.log(error);
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
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = { createVehicle, getVehicles, updateVehicle, deleteVehicle };