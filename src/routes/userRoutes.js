const express = require("express");
const router = express.Router();
const userController= require("../controllers/userController");

router.post("/register", userController.registerUser);
// Route to get user info
router.get("/getInfo/:uid", userController.getUserInfo);

// Route to update user info
router.put("/updateInfo/:uid", userController.updateUserInfo);

// Route to delete user
router.delete("/deleteUser/:uid", userController.deleteUser);

module.exports = router;
