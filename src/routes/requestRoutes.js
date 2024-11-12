// src/routes/requestRoutes.js
const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');

router.post('/createRequest', requestController.createRequest);
router.get('/getAllRequests', requestController.getAllRequests);
router.get('/getRequestsByID/:id', requestController.getRequestById);

module.exports = router;
