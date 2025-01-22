import React, { useState, useEffect } from "react";
import { getOrderByEmailApi } from "../../utils/orderAPI/orderAPI";
import { toast } from "react-toastify";
import {
  CancelledOrderApi,
  ShippedOrderApi,
} from "../../utils/driverAPI/driverAPI";

const ViewOrder = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getOrderByEmailApi();
        console.log("Order by email:", res);

        // Filter orders to show only those with status "pending" or "is shipping"
        if (res && res.length > 0) {
          const filteredOrders = res.filter(
            (order) =>
              order.status === "pending" || order.status === "is shipping" || order.status === "delivery to post office"
          );
          setOrders(filteredOrders);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Error fetching orders");
      }
    };

    fetchUser();
  }, []);

  const ShippedOrder = async (userId) => {
    try {
      const res = await ShippedOrderApi(userId);
      toast.success("Order status updated to shipped successfully!");
      const updatedOrders = orders.map((order) =>
        order._id === userId ? { ...order, status: "shipped" } : order
      );
      setOrders(updatedOrders);
    } catch (error) {
      console.error("Error update:", error);
      toast.error("Failed to update. Please try again.");
    }
  };

  const CancelledOrder = async (userId) => {
    try {
      const res = await CancelledOrderApi(userId);
      toast.success("Order status updated to canceled successfully!");
      const updatedOrders = orders.map((order) =>
        order._id === userId ? { ...order, status: "canceled" } : order
      );
      setOrders(updatedOrders);
    } catch (error) {
      console.error("Error update:", error);
      toast.error("Failed to update. Please try again.");
    }
  };

  return (
    <div>
      {orders.length === 0 ? (
        <p>You don't have any order!</p>
      ) : (
        <div>
          <h2>Order Information</h2>
          {orders.map((order) => (
            <div key={order._id}>
              <p>
                <strong>Order ID:</strong> {order._id}
              </p>
              <p>
                <strong>Sender Name:</strong> {order.senderName}
              </p>
              <p>
                <strong>Sender Number:</strong> {order.senderNumber}
              </p>
              <p>
                <strong>From Address:</strong> {order.fromAddress},{" "}
                {order.fromDistrict}, {order.fromWard}, {order.fromCity}
              </p>
              <p>
                <strong>Recipient Name:</strong> {order.recipientName}
              </p>
              <p>
                <strong>Recipient Number:</strong> {order.recipientNumber}
              </p>
              <p>
                <strong>To Address:</strong> {order.toAddress},{" "}
                {order.toDistrict}, {order.toWard}, {order.toCity}
              </p>
              <p>
                <strong>Order Weight:</strong> {order.orderWeight}
              </p>
              <p>
                <strong>Order Size:</strong> {order.orderSize}
              </p>
              <p>
                <strong>Type:</strong> {order.type}
              </p>
              <p>
                <strong>Message:</strong> {order.message}
              </p>
              <p>
                <strong>Price:</strong> {order.price}
              </p>
              <p>
                <strong>Status:</strong> {order.status}
              </p>
              <p>
                <strong>Created By:</strong> {order.createdBy}
              </p>
              <p>
                <strong>Created At:</strong> {order.createdAt}
              </p>
              <p>
                <strong>Driver:</strong> {order.driver}
              </p>
              <p>
                <strong>EstimatedDeliveryTime:</strong> {order.estimatedDeliveryTime}
              </p>
              <p>
                <strong>Distance:</strong> {order.distance} km
              </p>

              {/* Conditional rendering of buttons */}
              {order.status === "is shipping" && (
                <button onClick={() => ShippedOrder(order._id)}>Shipped</button>
              )}
              {order.status === "pending" && (
                <button onClick={() => CancelledOrder(order._id)}>
                  Cancelled
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewOrder;
