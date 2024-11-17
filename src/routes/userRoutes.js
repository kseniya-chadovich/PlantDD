const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/createUser', userController.createUser);
router.get('/getAllUsers', userController.getAllUsers);
router.get('/getUserByUsername/:user_name', userController.getUserByUsername);
router.get('/checkUsername/:user_name', userController.checkUsernameAvailability);
router.put('/updateUser/:user_name', userController.updateUser);
router.delete('/deleteUser/:user_name', userController.deleteUser);

module.exports = router;

