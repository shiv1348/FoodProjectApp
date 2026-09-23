import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { myOrders, clearErrors } from "../../redux/actions/orderActions";
import Loader from "../layout/Loader";
import Message from "../Message";
import { toast } from "react-toastify";

const ListOrders = () => {
  const dispatch = useDispatch();

  const { loading, error, orders } = useSelector((state) => state.order || {});

  useEffect(() => {
    dispatch(myOrders());

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, error]);

  return (
    <div className="container mt-4 mb-5">
      <h2 className="my-4 font-weight-bold">My Orders</h2>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : !orders || orders.length === 0 ? (
        <div className="text-center my-5 py-4">
          <h4>You have not placed any orders yet. 🍽️</h4>
          <Link to="/" className="btn btn-primary mt-3 px-4 py-2">
            Explore Restaurants
          </Link>
        </div>
      ) : (
        <div className="table-responsive bg-white rounded shadow-sm p-3">
          <table className="table table-hover align-middle mb-0">
            <thead className="thead-dark">
              <tr>
                <th scope="col">Order ID</th>
                <th scope="col">Date</th>
                <th scope="col">Num of Items</th>
                <th scope="col">Amount</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>
                    <span className="font-weight-bold text-monospace">
                      #{order._id.slice(-6).toUpperCase()}
                    </span>
                  </td>
                  <td>
                    {new Date(order.createdAt || Date.now()).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td>{order.orderItems?.length || 0} items</td>
                  <td className="font-weight-bold text-success">
                    ₹{order.finalTotal}
                  </td>
                  <td>
                    <span
                      className={`badge p-2 ${
                        order.orderStatus === "Delivered"
                          ? "badge-success text-white"
                          : "badge-warning text-dark"
                      }`}
                    >
                      {order.orderStatus || "Processing"}
                    </span>
                  </td>
                  <td>
                    <Link
                      to={`/eats/orders/${order._id}`}
                      className="btn btn-outline-primary btn-sm"
                      id="view_order_details"
                      style={{ color: "white", textDecoration: "none" }}
                    >
                      👁 View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ListOrders;
