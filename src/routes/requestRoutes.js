// src/routes/requestRoutes.js
const express = require('express');
const upload = require("../config/multer");
const router = express.Router();
const requestController = require('../controllers/requestController');

router.post('/createRequest', upload.single("file"), requestController.createRequest);
router.get('/getRequestsByUID/:uid', requestController.getRequestsByUID);

module.exports = router;
