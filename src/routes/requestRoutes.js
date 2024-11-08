// src/routes/requestRoutes.js
const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');

router.post('/requests', requestController.createRequest);
router.get('/requests', requestController.getAllRequests);
router.get('/requests/:id', requestController.getRequestById);

module.exports = router;
