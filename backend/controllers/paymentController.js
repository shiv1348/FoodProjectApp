const catchAsyncErrors = require('../middlewares/catchAsyncErrors')

const dotenv = require('dotenv')
dotenv.config({ path:"./config/config.env" })

const stripeKey = process.env.STRIPE_SECRET_KEY || process.env.STRIP_SECRET_KEY;
let stripe;
if (stripeKey) {
    stripe = require("stripe")(stripeKey);
}

//process payment api
exports.processPayment = catchAsyncErrors(async (req, res, next) => {
    if (!stripe) {
        return res.status(200).json({ url: `${process.env.FRONTEND_URL}/success?session_id=mock_session_12345` });
    }

    //create stripe checkout session
    const session = await stripe.checkout.sessions.create({
        customer_email: req.user.email,
        phone_number_collection: {
            enabled: true,
        },
        line_items: req.body.items.map((item) => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: item.foodItem.name,
                    images: [item.foodItem.images?.[0]?.url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"],
                },
                unit_amount: Math.round(item.foodItem.price * 100),
            },
            quantity: item.quantity,
        })),
        mode: "payment",
        shipping_address_collection: {
            allowed_countries: ["US", "IN"]
        },
        shipping_options: [
            {
                shipping_rate_data: {
                    display_name: "Delivery Charges",
                    type: "fixed_amount",
                    fixed_amount: {
                        amount: 5500, // 55 INR
                        currency: "inr"
                    },
                    delivery_estimate: {
                        minimum: {
                            unit: "hour",
                            value: 1
                        },
                        maximum: {
                            unit: "hour",
                            value: 2
                        }
                    }
                }
            }
        ],
        success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/cart`,
    });
    res.status(200).json({url: session.url})
})

//send stripe api key
exports.sendStripeApi = catchAsyncErrors(async (req, res, next) => {
    res.status(200).json({
        stripeApiKey: process.env.STRIPE_API_KEY
    })
})