import React, { useState, useEffect } from "react";
import { getOrderByEmailApi } from "../../utils/orderAPI/orderAPI";
import { toast } from "react-toastify";
import {
  CancelledOrderApi,
  ShippedOrderApi,
} from "../../utils/driverAPI/driverAPI";
import styles from "./ViewOrder.module.css";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

const ViewOrder = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const res = await getOrderByEmailApi();
        console.log("Order by email:", res);

        if (res && res.length > 0) {
          const filteredOrders = res.filter(
            (order) =>
              order.status === "pending" ||
              order.status === "is shipping" ||
              order.status === "delivery to post office" ||
              order.status === "prepare to delivery"
          );
          setOrders(filteredOrders);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Error fetching orders");
      } finally {
        setIsLoading(false); // Mark loading as complete
      }
    };

    fetchUser();
  }, []);

  const ShippedOrder = async (userId) => {
    try {
      await ShippedOrderApi(userId);
      toast.success("Order status updated to shipped successfully!");
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === userId ? { ...order, status: "shipped" } : order
        )
      );
    } catch (error) {
      console.error("Error update:", error);
      toast.error("Failed to update. Please try again.");
    }
  };

  const CancelledOrder = async (userId) => {
    try {
      await CancelledOrderApi(userId);
      toast.success("Order status updated to canceled successfully!");
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === userId ? { ...order, status: "canceled" } : order
        )
      );
    } catch (error) {
      console.error("Error update:", error);
      toast.error("Failed to update. Please try again.");
    }
  };

  if (isLoading) {
    // Hiển thị trạng thái Loading
    return <LoadingSpinner isLoading={isLoading}></LoadingSpinner>;
  }

  return (
    <div className={styles.Container}>
      {orders.length === 0 ? (
        <p>You don't have any order!</p>
      ) : (
        <div>
          <h2>Order Information</h2>
          {orders.map((order) => (
            <div key={order._id} className={styles.orderContainer}>
              <p>
                <strong>Order ID:</strong> {order._id}
              </p>
              <p>
                <strong>From:</strong> {order.fromAddress}, {order.fromDistrict}
                , {order.fromWard}, {order.fromCity}
              </p>
              <p>
                <strong>To:</strong> {order.toAddress}, {order.toDistrict},{" "}
                {order.toWard}, {order.toCity}
              </p>
              <p>
                <strong>Status:</strong> {order.status}
              </p>
              {/* Timeline Display */}
              {order.timeline && order.timeline.length > 0 && (
                <div className={styles.timeline}>
                  <ul>
                    {order.timeline.map((entry, index) => (
                      <li key={entry._id}>
                        {new Date(
                          new Date(entry.timestamp).getTime() +
                            17 * 60 * 60 * 1000
                        ).toLocaleString()}: <strong>{entry.status}</strong>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <button
                onClick={() => {
                  setExpandedOrder(order);
                  setShowPopup(true);
                }}
              >
                Show Details
              </button>
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

      {showPopup && expandedOrder && (
        <div
          className={styles.popupOverlay}
          onClick={() => setShowPopup(false)}
        >
          <div
            className={styles.popupContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.closeButton}
              onClick={() => setShowPopup(false)}
            >
              x
            </button>
            <div className={styles.orderDetails}>
              <p>
                <strong>Sender Name:</strong> {expandedOrder.senderName}
              </p>
              <p>
                <strong>Sender Number:</strong> {expandedOrder.senderNumber}
              </p>
              <p>
                <strong>Recipient Name:</strong> {expandedOrder.recipientName}
              </p>
              <p>
                <strong>Recipient Number:</strong>{" "}
                {expandedOrder.recipientNumber}
              </p>
              <p>
                <strong>Order Weight:</strong> {expandedOrder.orderWeight}
              </p>
              <p>
                <strong>Order Size:</strong> {expandedOrder.orderSize}
              </p>
              <p>
                <strong>Type:</strong> {expandedOrder.type}
              </p>
              <p>
                <strong>Message:</strong> {expandedOrder.message}
              </p>
              <p>
                <strong>Price:</strong> {expandedOrder.price}
              </p>
              <p>
                <strong>Created At:</strong> {expandedOrder.createdAt}
              </p>
              <p>
                <strong>Driver:</strong> {expandedOrder.driver}
              </p>
              <p>
                <strong>Estimated Delivery Time:</strong>{" "}
                {expandedOrder.estimatedDeliveryTime}
              </p>
              <p>
                <strong>Distance:</strong> {expandedOrder.distance} km
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewOrder;
