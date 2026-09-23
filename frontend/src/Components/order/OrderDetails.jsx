import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getOrderDetails, clearErrors } from "../../redux/actions/orderActions";
import socket from "../../utils/socket";
import Loader from "../layout/Loader";
import Message from "../Message";
import { toast } from "react-toastify";

const OrderDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { loading, error, order } = useSelector((state) => state.order || {});
  const [liveStatus, setLiveStatus] = useState(null);

  useEffect(() => {
    dispatch(getOrderDetails(id));

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    // Real-time socket order room listener
    if (id) {
      socket.emit("joinOrder", id);

      const statusListener = (data) => {
        if (data.orderId === id) {
          setLiveStatus(data.status);
          toast.info(`🔔 Real-Time Order Update: ${data.status}`);
        }
      };

      socket.on("orderStatusUpdate", statusListener);

      return () => {
        socket.off("orderStatusUpdate", statusListener);
      };
    }
  }, [dispatch, id, error]);

  const deliveryInfo = order?.deliveryInfo;
  const shippingDetails =
    deliveryInfo &&
    `${deliveryInfo.address}, ${deliveryInfo.city}, ${deliveryInfo.postalCode}, ${deliveryInfo.country}`;

  const isPaid =
    order?.paymentInfo &&
    (order.paymentInfo.status === "succeeded" ||
      order.paymentInfo.status === "paid" ||
      order.paymentInfo.status === "Processing");

  return (
    <div className="container mt-4 mb-5">
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : order ? (
        <div className="row d-flex justify-content-between">
          <div className="col-12 col-lg-8 mt-3 order-details">
            <h2 className="my-4 font-weight-bold">
              Order #{order._id}
            </h2>

            <h4 className="mb-3 font-weight-bold">Shipping Info</h4>
            <p>
              <b>Name:</b> {order.user && order.user.name}
            </p>
            <p>
              <b>Phone:</b> {deliveryInfo && deliveryInfo.phoneNo}
            </p>
            <p className="mb-4">
              <b>Address:</b> {shippingDetails}
            </p>
            <p>
              <b>Amount:</b> ₹{order.finalTotal}
            </p>

            <hr />

            <h4 className="my-3 font-weight-bold">Payment</h4>
            <p className={isPaid ? "greenColor font-weight-bold" : "redColor font-weight-bold"}>
              <b>{isPaid ? "PAID" : "NOT PAID"}</b>
            </p>

            <div className="d-flex align-items-center gap-2 my-3">
              <h4 className="m-0 font-weight-bold">Order Status</h4>
              <span className="badge bg-success text-white small px-2 py-1">⚡ Live Socket Tracking</span>
            </div>
            <p
              className={
                (liveStatus || order.orderStatus) && String(liveStatus || order.orderStatus).includes("Delivered")
                  ? "greenColor font-weight-bold fs-5"
                  : "text-warning font-weight-bold fs-5"
              }
            >
              <b>{liveStatus || order.orderStatus || "Processing"}</b>
            </p>

            <hr />

            <h4 className="my-4 font-weight-bold">Order Items:</h4>

            <div className="cart-item my-1">
              {order.orderItems &&
                order.orderItems.map((item) => (
                  <div key={item.fooditem} className="row my-3 align-items-center">
                    <div className="col-3 col-lg-2">
                      <img
                        src={item.image || "/images/placeholder.png"}
                        alt={item.name}
                        height="55"
                        width="70"
                        className="rounded"
                        style={{ objectFit: "cover" }}
                      />
                    </div>

                    <div className="col-5 col-lg-6">
                      <span className="font-weight-bold">{item.name}</span>
                    </div>

                    <div className="col-4 col-lg-4 text-right">
                      <p className="mb-0">
                        ₹{item.price} x {item.quantity} ={" "}
                        <b>₹{(item.quantity * item.price).toFixed(2)}</b>
                      </p>
                    </div>
                  </div>
                ))}
            </div>

            <hr />

            <div className="mt-4">
              <Link to="/eats/orders/me/myOrders" className="btn btn-outline-secondary">
                ← Back to My Orders
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default OrderDetails;
