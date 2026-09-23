
const ErrorHandler = require("../utils/errorHandler")
const catchAsyncErrors = require("../middlewares/catchAsyncErrors")
const APIFeatures = require("../utils/apiFeatures")
const Restaurant = require("../models/restaurant")


//get all restaurants
exports.getAllRestaurants = catchAsyncErrors(async(req,res,next) => {
    let query = Restaurant.find();
    
    // Support filtering by keyword
    if (req.query.keyword) {
        query = query.find({
            name: { $regex: req.query.keyword, $options: "i" }
        });
    }

    const apiFeatures = new APIFeatures(query, req.query).sort();

    const restaurants = await apiFeatures.query;
    const pureVegRestaurantsCount = restaurants.filter(r => r.isVeg).length;

    res.status(200).json({
        status: "success",
        count: restaurants.length,
        pureVegRestaurantsCount,
        restaurants: restaurants,
        restaurant: restaurants // for compatibility with legacy actions
    });
});

//get restaurant count
exports.getRestaurantsCount = catchAsyncErrors(async(req, res, next) => {
    const count = await Restaurant.countDocuments();
    const pureVegRestaurantsCount = await Restaurant.countDocuments({ isVeg: true });
    res.status(200).json({
        status: "success",
        count,
        pureVegRestaurantsCount
    });
});

//get restaurants by its id
exports.getRestaurantById = catchAsyncErrors(async(req,res,next) => {
    const restaurant = await Restaurant.findById(req.params.storeId);

    if(!restaurant){
        return next(new ErrorHandler("Restaurant not found", 404))
    }

    res.status(200).json({
        status: "success",
        data: restaurant
    })
})