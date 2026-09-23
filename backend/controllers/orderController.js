const Order = require("../models/order");
const FoodItem = require("../models/foodItem");
const Cart = require("../models/cartModel");
const { ObjectId } = require("mongodb");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const dotenv = require("dotenv");

//setting up config file
dotenv.config({ path: "./config/config.env" });
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Create a new order   =>  /api/v1/order/new
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const { session_id, orderItems, deliveryInfo, paymentInfo, itemsPrice, taxPrice, deliveryCharge, finalTotal, restaurant } = req.body;

  let finalDeliveryInfo;
  let finalOrderItems;
  let finalPaymentInfo;
  let finalRestaurant;
  let finalItemsPrice;
  let finalDeliveryCharge;
  let finalAmountTotal;

  // Case 1: Stripe Session ID provided
  if (session_id && stripe) {
    try {
      const session = await stripe.checkout.sessions.retrieve(session_id, {
        expand: ["customer"],
      });

      const cart = await Cart.findOne({ user: req.user._id })
        .populate({
          path: "items.foodItem",
          select: "name price images",
        })
        .populate({
          path: "restaurant",
          select: "name",
        });

      if (!cart || !cart.items || cart.items.length === 0) {
        return next(new ErrorHandler("Cart is empty or not found", 400));
      }

      finalDeliveryInfo = {
        address: session.shipping_details?.address?.line1 || "Street Address",
        city: session.shipping_details?.address?.city || "City",
        phoneNo: session.customer_details?.phone || req.user.phonenumber || "9876543210",
        postalCode: session.shipping_details?.address?.postal_code || "560001",
        country: session.shipping_details?.address?.country || "IN",
      };

      finalOrderItems = cart.items.map((item) => ({
        name: item.foodItem.name,
        quantity: item.quantity,
        image: item.foodItem.images?.[0]?.url || "/images/placeholder.png",
        price: item.foodItem.price,
        fooditem: item.foodItem._id,
      }));

      finalPaymentInfo = {
        id: session.payment_intent || session.id,
        status: session.payment_status || "paid",
      };

      finalDeliveryCharge = session.shipping_cost?.amount_subtotal ? (+session.shipping_cost.amount_subtotal / 100) : 55;
      finalItemsPrice = session.amount_subtotal ? (+session.amount_subtotal / 100) : 0;
      finalAmountTotal = session.amount_total ? (+session.amount_total / 100) : (finalItemsPrice + finalDeliveryCharge);
      finalRestaurant = cart.restaurant._id;
    } catch (e) {
      console.error("Stripe session retrieval failed, using fallback:", e.message);
    }
  }

  // Case 2: Direct payload provided from frontend
  if (!finalOrderItems && orderItems && orderItems.length > 0) {
    finalDeliveryInfo = deliveryInfo;
    finalOrderItems = orderItems;
    finalPaymentInfo = paymentInfo || {
      id: "pay_" + Date.now(),
      status: "succeeded",
    };
    finalItemsPrice = itemsPrice;
    finalDeliveryCharge = deliveryCharge;
    finalAmountTotal = finalTotal;
    finalRestaurant = restaurant;
  }

  if (!finalOrderItems || finalOrderItems.length === 0) {
    return next(new ErrorHandler("No order items specified", 400));
  }

  const order = await Order.create({
    orderItems: finalOrderItems,
    deliveryInfo: finalDeliveryInfo,
    paymentInfo: finalPaymentInfo,
    deliveryCharge: finalDeliveryCharge || 55,
    itemsPrice: finalItemsPrice || 0,
    taxPrice: taxPrice || 0,
    finalTotal: finalAmountTotal || 0,
    user: req.user.id || req.user._id,
    restaurant: finalRestaurant,
    paidAt: Date.now(),
  });

  // Clear user cart if exists
  await Cart.findOneAndDelete({ user: req.user._id });

  res.status(200).json({
    success: true,
    order,
  });
});

// Get single order   =>   /api/v1/orders/:id
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email")
    .populate("restaurant")
    .exec();

  if (!order) {
    return next(new ErrorHandler("No Order found with this ID", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// Get logged in user orders   =>   /api/v1/orders/me
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
  // Get the user ID from req.user
  const userId = new ObjectId(req.user.id);
  // Find orders for the specific user using the retrieved user ID
  const orders = await Order.find({ user: userId })
    .populate("user", "name email")
    .populate("restaurant")
    .exec();

  res.status(200).json({
    success: true,
    orders,
  });
});

// Get all orders - ADMIN  =>   /api/v1/admin/orders/
exports.allOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find();

  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.finalTotal;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});
