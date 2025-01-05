import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  CancelledOrderApi,
  getDriverOrderByEmailApi,
  ShippedOrderApi,
} from "../../utils/driverAPI/driverAPI";

const DriverMangeOrder = () => {
  const [orders, setOrders] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getDriverOrderByEmailApi();
        console.log("Order by email:", res);
        console.log("Order by email length:", res.length);

        // Check if the response has orders data
        if (res && res.length > 0) {
          setOrders(res); // Assuming the orders are in res.data
        } else {
          setOrders([]); // If no orders, set as empty
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
      console.log("Shipped Order Response:", res);
      toast.success("Order status updated to driver successfully!");
      // Update the user's role in the table
      const updatedData = data.map((order) =>
        order._id === userId ? { ...order } : order
      );
      setData(updatedData);
    } catch (error) {
      console.error("Error update:", error);
      toast.error("Failed to update. Please try again.");
    }
  };

  const CancelledOrder = async (userId) => {
    try {
      const res = await CancelledOrderApi(userId);
      console.log("Cancelled Order Response:", res);
      toast.success("Order status updated to driver successfully!");
      // Update the user's role in the table
      const updatedData = data.map((order) =>
        order._id === userId ? { ...order } : order
      );
      setData(updatedData);
    } catch (error) {
      console.error("Error update:", error);
      toast.error("Failed to update. Please try again.");
    }
  };

  return (
    <div>
      {orders.length === 0 ? (
        <p>You don't have any order!</p> // Display message if no orders
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
                <strong>From Address:</strong> {order.fromAddress}
              </p>
              <p>
                <strong>From District:</strong> {order.fromDistrict}
              </p>
              <p>
                <strong>From City:</strong> {order.fromCity}
              </p>
              <p>
                <strong>Recipient Name:</strong> {order.recipientName}
              </p>
              <p>
                <strong>Recipient Number:</strong> {order.recipientNumber}
              </p>
              <p>
                <strong>To Address:</strong> {order.toAddress}
              </p>
              <p>
                <strong>To District:</strong> {order.toDistrict}
              </p>
              <p>
                <strong>To City:</strong> {order.toCity}
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
                <strong>Driver:</strong> {order.driver}
              </p>

              {/* Status Messages */}
              {order.status === "shipped" && (
                <p style={{ color: "green", fontWeight: "bold" }}>
                  Order shipped successfully
                </p>
              )}
              {order.status === "canceled" && (
                <p style={{ color: "red", fontWeight: "bold" }}>
                  Order canceled
                </p>
              )}

              {/* Conditional Buttons */}
              {order.status !== "shipped" && order.status !== "canceled" && (
                <div>
                  <button onClick={() => ShippedOrder(order._id)}>
                    Shipped
                  </button>
                  <button onClick={() => CancelledOrder(order._id)}>
                    Cancelled
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DriverMangeOrder;
