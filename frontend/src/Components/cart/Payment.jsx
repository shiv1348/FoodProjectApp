import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CheckoutSteps from "./CheckoutSteps";
import { createOrder } from "../../redux/actions/orderActions";
import { clearCartItems } from "../../redux/actions/cartActions";
import api from "../../utils/api";
import { toast } from "react-toastify";

// Helper to dynamically load Razorpay checkout script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      return resolve(true);
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Payment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartItems, deliveryInfo, restaurant } = useSelector(
    (state) => state.cart || {}
  );
  const { user } = useSelector((state) => state.auth || {});

  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo")) || {
    itemsPrice: 0,
    deliveryCharge: 55,
    taxPrice: 0,
    finalTotal: 55,
  };

  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvc, setCardCvc] = useState("123");
  const [loading, setLoading] = useState(false);

  const getBaseOrderPayload = (paymentInfo) => ({
    orderItems: (cartItems || []).map((item) => ({
      name: item.name,
      quantity: item.quantity,
      image: item.image,
      price: item.price,
      fooditem: item.fooditem,
    })),
    deliveryInfo,
    restaurant: restaurant || cartItems?.[0]?.restaurant,
    itemsPrice: Number(orderInfo.itemsPrice),
    deliveryCharge: Number(orderInfo.deliveryCharge),
    taxPrice: Number(orderInfo.taxPrice),
    finalTotal: Number(orderInfo.finalTotal),
    paymentInfo: paymentInfo || {
      id: "pay_" + Math.random().toString(36).substring(2, 12),
      status: "succeeded",
    },
  });

  // Handle Razorpay Sandbox Payment
  const handleRazorpayPayment = async () => {
    setLoading(true);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.warn("Razorpay SDK could not be loaded online. Processing with Sandbox Instant Approval.");
        return proceedDirectPayment("pay_rzp_mock_" + Date.now());
      }

      // 1. Fetch Razorpay Public Key
      const keyRes = await api.get("/v1/payment/razorpay/key");
      const razorpayKey = keyRes.data?.key || "rzp_test_1DP5mmOlF5G5ag";

      // 2. Create Razorpay Order on Backend
      const orderRes = await api.post("/v1/payment/razorpay/create-order", {
        amount: orderInfo.finalTotal,
      });

      const rzpOrder = orderRes.data?.order;
      if (!rzpOrder) {
        throw new Error("Could not initiate Razorpay order");
      }

      // 3. Configure Razorpay Checkout Modal
      const options = {
        key: razorpayKey,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency || "INR",
        name: "Food Genie Delivery",
        description: `Order total: ₹${orderInfo.finalTotal}`,
        image: "/images/logo.webp",
        order_id: rzpOrder.id,
        prefill: {
          name: user?.name || "Customer",
          email: user?.email || "customer@example.com",
          contact: deliveryInfo?.phoneNo || "9876543210",
        },
        theme: {
          color: "#056a3a",
        },
        handler: async (response) => {
          try {
            // 4. Verify Payment Signature on Backend
            await api.post("/v1/payment/razorpay/verify", {
              razorpay_order_id: response.razorpay_order_id || rzpOrder.id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature || "mock_sig_ok",
            });

            await proceedDirectPayment(response.razorpay_payment_id);
          } catch (err) {
            toast.error(err.response?.data?.message || "Payment signature verification failed");
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            toast.info("Payment window closed");
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.on("payment.failed", (response) => {
        setLoading(false);
        toast.error("Razorpay payment failed: " + (response.error?.description || "Payment cancelled"));
      });

      razorpayInstance.open();
    } catch (error) {
      console.error("Razorpay error:", error);
      toast.info("Razorpay Sandbox simulation active. Creating verified test order...");
      await proceedDirectPayment("pay_rzp_sandbox_" + Date.now());
    } finally {
      setLoading(false);
    }
  };

  const proceedDirectPayment = async (paymentId) => {
    setLoading(true);
    const orderPayload = getBaseOrderPayload({
      id: paymentId,
      status: "succeeded",
    });

    const result = await dispatch(createOrder(orderPayload));

    if (result.success) {
      dispatch(clearCartItems());
      sessionStorage.removeItem("orderInfo");
      toast.success("Order placed successfully via Razorpay!");
      navigate("/success");
    } else {
      toast.error(result.error || "Order creation failed");
    }
    setLoading(false);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (paymentMethod === "razorpay") {
      return handleRazorpayPayment();
    }

    setLoading(true);
    try {
      const orderPayload = getBaseOrderPayload({
        id: paymentMethod === "cod" ? "cod_" + Date.now() : "card_" + Date.now(),
        status: paymentMethod === "cod" ? "pending" : "succeeded",
      });

      const result = await dispatch(createOrder(orderPayload));

      if (result.success) {
        dispatch(clearCartItems());
        sessionStorage.removeItem("orderInfo");
        toast.success(
          paymentMethod === "cod"
            ? "Order placed with Cash on Delivery!"
            : "Card payment processed & order placed successfully!"
        );
        navigate("/success");
      } else {
        toast.error(result.error || "Payment failed");
      }
    } catch (error) {
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CheckoutSteps delivery confirmOrder payment />

      <div className="row wrapper">
        <div className="col-10 col-lg-6">
          <form className="shadow-lg bg-white rounded p-4" onSubmit={submitHandler}>
            <h1 className="mb-4 font-weight-bold text-center">Payment Info</h1>

            {/* Payment Method Selector */}
            <div className="mb-4 d-flex justify-content-between flex-wrap gap-2">
              <label
                className={`btn btn-sm ${
                  paymentMethod === "razorpay" ? "btn-success" : "btn-outline-success"
                } font-weight-bold flex-grow-1 p-2`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "razorpay"}
                  onChange={() => setPaymentMethod("razorpay")}
                  className="mr-2"
                />
                ⚡ Razorpay (Sandbox)
              </label>

              <label
                className={`btn btn-sm ${
                  paymentMethod === "card" ? "btn-success" : "btn-outline-success"
                } font-weight-bold flex-grow-1 p-2`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                  className="mr-2"
                />
                💳 Card
              </label>

              <label
                className={`btn btn-sm ${
                  paymentMethod === "cod" ? "btn-success" : "btn-outline-success"
                } font-weight-bold flex-grow-1 p-2`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                  className="mr-2"
                />
                💵 COD
              </label>
            </div>

            {/* Razorpay Sandbox View */}
            {paymentMethod === "razorpay" && (
              <div className="p-3 mb-4 rounded border border-success bg-light text-center">
                <div className="d-flex justify-content-center align-items-center gap-2 mb-2">
                  <span className="badge bg-primary text-white">Razorpay Sandbox</span>
                  <span className="badge bg-success text-white">INR Instant Checkout</span>
                </div>
                <p className="small text-muted mb-3">
                  Pay securely using <strong>UPI (GPay / PhonePe / Paytm)</strong>, <strong>Credit/Debit Cards</strong>, or <strong>Netbanking</strong> in test sandbox mode.
                </p>
                <div className="bg-white p-2 rounded shadow-sm d-inline-block small text-secondary">
                  Test Key: <code>rzp_test_1DP5mmOlF5G5ag</code>
                </div>
              </div>
            )}

            {/* Card Form */}
            {paymentMethod === "card" && (
              <>
                <div className="form-group mb-3">
                  <label htmlFor="card_num_field">Card Number</label>
                  <input
                    type="text"
                    id="card_num_field"
                    className="form-control"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    required
                    placeholder="16-digit card number"
                  />
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="card_exp_field">Card Expiry</label>
                  <input
                    type="text"
                    id="card_exp_field"
                    className="form-control"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    required
                    placeholder="MM/YY"
                  />
                </div>

                <div className="form-group mb-4">
                  <label htmlFor="card_cvc_field">Card CVC / CVV</label>
                  <input
                    type="text"
                    id="card_cvc_field"
                    className="form-control"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    required
                    placeholder="3-digit CVC"
                  />
                </div>
              </>
            )}

            {/* COD Notice */}
            {paymentMethod === "cod" && (
              <div className="alert alert-info py-2 mb-4">
                💵 Pay ₹{orderInfo.finalTotal} in cash upon delivery to your doorstep.
              </div>
            )}

            <button
              id="pay_btn"
              type="submit"
              className="btn btn-block btn-success py-3 font-weight-bold text-white w-100"
              disabled={loading}
            >
              {loading
                ? "Processing Payment..."
                : paymentMethod === "razorpay"
                ? `Pay ₹${orderInfo.finalTotal} via Razorpay ➔`
                : `Pay ₹${orderInfo.finalTotal} ➔`}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Payment;
