// src/routes/requestRoutes.js
const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const upload = require("../config/multer");

router.post('/createRequest', upload.single("file"), requestController.createRequest);
router.get('/getRequestsByUID/:uid', requestController.getRequestByUId);

module.exports = router;
