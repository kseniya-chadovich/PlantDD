// src/routes/requestRoutes.js
const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const upload = require("../config/multer");

router.post('/uploadImage', requestController.uploadImageToBucket);
router.get('/getRequestsByUID/:uid', requestController.getRequestsByUID);

module.exports = router;
