const express = require("express");
const router = express.Router();
const userController= require("../controllers/userController");
const upload = require('../config/multer');

router.post("/uploadProfilePicture",upload.single('file'), userController.uploadProfileToBucket);
router.post("/register", userController.registerUser);
router.get("/getInfo/:uid", userController.getUserInfo);
router.put("/updateInfo/:uid", userController.updateUserInfo);

module.exports = router;
