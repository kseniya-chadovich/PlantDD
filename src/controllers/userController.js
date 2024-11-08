const User = require('../models/User');

// Helper function for error handling
const handleError = (res, error, statusCode = 500) => {
  res.status(statusCode).json({ error: error.message });
};

// Create a new user
const createUser = async (req, res) => {
  const { first_name, last_name, password } = req.body;
  try {
    const newUser = await User.create({ first_name, last_name, password });
    res.status(201).json(newUser);
  } catch (error) {
    handleError(res, error, 400);
  }
};

// Get a user by ID
const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    handleError(res, error);
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    handleError(res, error);
  }
};

// Update a user by ID
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, password } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.first_name = first_name;
    user.last_name = last_name;
    user.password = password;

    await user.save();  // Save the updated user
    res.json(user);      // Return the updated user
  } catch (error) {
    handleError(res, error);
  }
};

// Delete a user by ID
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.destroy();  // Delete the user from the database
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    handleError(res, error);
  }
};

// Export all controller functions
module.exports = {
  createUser,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
};
