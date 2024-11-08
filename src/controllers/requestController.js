// src/controllers/requestController.js
const Request = require('../models/request');

// Helper function to handle errors
const handleError = (res, error, statusCode = 500) => {
  res.status(statusCode).json({ error: error.message });
};

// Function to create a new request
const createRequest = async (req, res) => {
  try {
    const request = await addRequest(req.body);
    res.status(201).json(request);
  } catch (error) {
    handleError(res, error, 400);
  }
};

// Function to get all requests
const getAllRequests = async (req, res) => {
  try {
    const requests = await fetchAllRequests();
    res.status(200).json(requests);
  } catch (error) {
    handleError(res, error);
  }
};

// Function to get a specific request by ID
const getRequestById = async (req, res) => {
  try {
    const request = await fetchRequestById(req.params.id);
    if (!request) {
      return handleError(res, new Error('Request not found'), 404);
    }
    res.status(200).json(request);
  } catch (error) {
    handleError(res, error);
  }
};

// Wrapper for database interaction - adds a new request to the database
const addRequest = async ({ user_id, image_url }) => {
  return await Request.create({
    user_id,
    image_url,
    uploaded_at: new Date(),
  });
};

// Wrapper for database interaction - fetches all requests
const fetchAllRequests = async () => {
  return await Request.findAll();
};

// Wrapper for database interaction - fetches a request by ID
const fetchRequestById = async (id) => {
  return await Request.findByPk(id);
};

// Export controller functions
module.exports = {
  createRequest,
  getAllRequests,
  getRequestById,
};
