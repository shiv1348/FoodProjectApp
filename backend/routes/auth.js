const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController")

router.post("/signup", authController.signup);
router.post("/register", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.get("/me", authController.protect, authController.getUserProfile);
router.put("/me/update", authController.protect, authController.updateProfile);

module.exports = router;