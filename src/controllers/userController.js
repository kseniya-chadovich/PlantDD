const User = require('../models/User');
const bcrypt = require('bcrypt');

// Helper function for error handling
const handleError = (res, error, statusCode = 500) => {
  res.status(statusCode).json({ error: error.message });
};

// Create a new user (signup)
const createUser = async (req, res) => {
  const {first_name, last_name, password, user_name, email} = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      first_name,
      last_name,
      password: hashedPassword,
      user_name,
      email,
    });
    res.status(201).json({
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      user_name:newUser.user_name,
      email: newUser.email
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(400).json({ error: "User could not be created" });
  }
};


// Get a user by username
const getUserByUsername = async (req, res) => {
  const { user_name } = req.params; 
  try {
    const user = await User.findOne({
      where: { user_name }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    handleError(res, error); 
  }
};

const getUserByEmail = async (req, res) => {
  const { email } = req.params; 
  try {
    const user = await User.findOne({
      where: { email }
    });

    if (!user) {
      return res.status(404).json({ message: 'Email not found' });
    }
    
    res.json( user );
  } catch (error) {
    console.error('Error fetching user by email:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Backend: Validate Password
const validatePassword = async (req, res) => {
  const { user_name, password } = req.body;
  try {
    const user = await User.findOne({
      where: { user_name }
    });

    if (!user) {
      return res.status(404).json({ correct: false });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    res.json({ correct: isMatch });
  } catch (error) {
    console.error('Error during password validation:', error);
    res.status(500).json({ correct: false });
  }
};


const checkUsernameAvailability = async (req, res) => {
  const { user_name } = req.params;
  try {
    const user = await User.findOne({ where: { user_name } });
    res.json({ available: !user });
  } catch (error) {
    res.status(500).json({ message: 'Error checking username availability' });
  }
};

const checkEmailAvailability = async (req, res) => {
  const { email } = req.params;
  try {
    const user = await User.findOne({ where: { email } });
    res.json({ available: !user });
  } catch (error) {
    res.status(500).json({ message: 'Error checking email availability' });
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
  const { username } = req.params;
  const {user_name, first_name, last_name, password } = req.body;

  try {
    const user = await User.findByPk(username);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.user_name = user_name;
    user.first_name = first_name;
    user.last_name = last_name;
    user.password = password;

    await user.save();  // Save the updated user
    res.json(user);      // Return the updated user
  } catch (error) {
    handleError(res, error);
  }
};

// Delete a user by username
const deleteUser = async (req, res) => {
  const { user_name } = req.params;

  try {
    const user = await User.findByPk(user_name);
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
  getUserByUsername,
  getUserByEmail,
  validatePassword,
  checkUsernameAvailability,
  getAllUsers,
  updateUser,
  deleteUser, 
  checkEmailAvailability
};
