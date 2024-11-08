const express = require('express');
const userRoutes = require('./userRoutes');
const requestRoutes = require('./requestRoutes');
//const uploadImageRoutes = require('./uploadImageRoutes');

const router = express.Router();

router.use('/users', userRoutes);
router.use('/requests', requestRoutes);
// router.use('/upload', uploadImageRoutes);

module.exports = router;
