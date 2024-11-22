// src/routes/requestRoutes.js
const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const upload = require('../config/multer');

router.post('/uploadImage',upload.single('file'), requestController.uploadImageToBucket);
router.get('/getLinks/:uid', requestController.getRequestsByUID);
router.post('/storeLink', requestController.storeLinkToRequest);

module.exports = router;
