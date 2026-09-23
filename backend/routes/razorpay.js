const express = require("express");
const router = express.Router();
const {
  getRazorpayKey,
  createRazorpayOrder,
  verifyRazorpayPayment,
} = require("../controllers/razorpayController");
const authController = require("../controllers/authController");

router.get("/key", getRazorpayKey);
router.post("/create-order", authController.protect, createRazorpayOrder);
router.post("/verify", authController.protect, verifyRazorpayPayment);

module.exports = router;
