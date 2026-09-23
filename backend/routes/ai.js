const express = require("express");
const router = express.Router();
const {
  getFeaturedRecommendations,
  chatWithGenie,
  getRestaurantAnalytics,
} = require("../controllers/aiController");

// AI endpoints
router.get("/featured-recommendations", getFeaturedRecommendations);
router.post("/chat", chatWithGenie);
router.get("/restaurant/:storeId/analytics", getRestaurantAnalytics);

module.exports = router;
