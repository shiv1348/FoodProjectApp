const express = require("express");
const router = express.Router();
const { getAllRestaurants, getRestaurantById, getRestaurantsCount } = require("../controllers/restaurantController");
const menuRouter = require("./menu");

// Count
router.route("/count").get(getRestaurantsCount);

// Nested menus route: /api/v1/eats/stores/:storeId/menus
router.use("/:storeId/menus", menuRouter);

router.route("/").get(getAllRestaurants);
router.route("/:storeId").get(getRestaurantById);

module.exports = router;