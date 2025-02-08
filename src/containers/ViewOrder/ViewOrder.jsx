import React, { useState, useEffect } from "react";
import { getOrderByEmailApi } from "../../utils/orderAPI/orderAPI";
import { toast } from "react-toastify";
import {
  CancelledOrderApi,
  ShippedOrderApi,
} from "../../utils/driverAPI/driverAPI";
import styles from "./ViewOrder.module.css";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";

const ViewOrder = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const res = await getOrderByEmailApi();
        if (res && res.length > 0) {
          const filteredOrders = res.filter(
            (order) =>
              order.status === "pending" ||
              order.status === "is shipping" ||
              order.status === "delivery to post office" ||
              order.status === "prepare to delivery" ||
              order.status === "canceled"
          );
          setOrders(filteredOrders);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Error fetching orders");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, status) => {
    try {
      if (status === "shipped") {
        await ShippedOrderApi(orderId);
        toast.success("Order marked as shipped!");
      } else if (status === "canceled") {
        await CancelledOrderApi(orderId);
        toast.success("Order canceled successfully!");
      }
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status } : order
        )
      );
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order status. Please try again.");
    }
  };

  if (isLoading) {
    return <LoadingSpinner isLoading={isLoading} />;
  }

  return (
    <div className={styles.Container}>
      {orders.length === 0 ? (
        <p>You don't have any orders!</p>
      ) : (
        <div className={styles.containeroverview}>
          <div>
            <button className={styles.addnew} onClick={() => navigate("/guestcreateorder")}>Add New +</button>
            {orders.map((order) => (
              <div key={order._id} className={styles.orderContainer}>
                <div className={styles.orderstatus}>
                  <p>
                    <strong>Order ID:</strong> {order._id}
                  </p>
                  <p>
                    <strong>Status:</strong> {order.status}
                  </p>
                </div>

                {/* Đổi màu khi đơn hàng được chọn */}
                <div
                  className={`${styles.orderaddress} ${
                    selectedOrder?._id === order._id ? styles.selectedOrder : ""
                  }`}
                >
                  <div className={styles.fromstatus}>
                    <p>
                      <strong>From:</strong> {order.fromAddress},{" "}
                      {order.fromDistrict}, {order.fromCity}
                    </p>
                    <p>
                      {new Date(order.createdAt).toLocaleDateString("en-GB")}
                    </p>
                  </div>

                  {order.senderNumber}

                  <div className={styles.tostatus}>
                    <p>
                      <strong>To:</strong> {order.toAddress}, {order.toDistrict}
                      , {order.toCity}
                    </p>
                    <p>{order.estimatedDeliveryTime}</p>
                  </div>

                  {order.recipientNumber}

                  <button onClick={() => setSelectedOrder(order)}>
                    Show Details
                  </button>

                  {order.status === "is shipping" && (
                    <button
                      onClick={() => updateOrderStatus(order._id, "shipped")}
                    >
                      Shipped
                    </button>
                  )}
                  {order.status === "pending" && (
                    <button
                      onClick={() => updateOrderStatus(order._id, "canceled")}
                    >
                      Cancelled
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Overview Section */}
          <div className={styles.overview}>
            <h3>Overview</h3>
            <div className={styles.map}>
              <MapContainer
                center={[10.7336, 106.6989]}
                zoom={13}
                style={{ height: "300px", width: "600px" }}
                zoomControl={false}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
              </MapContainer>
            </div>

            <div className={styles.orderoverview}>
              {selectedOrder ? (
                <div className={styles.overviewgroup}>
                  <div>
                    <p>
                      <strong>Recipient Name:</strong>{" "}
                      {selectedOrder.recipientName}
                    </p>
                    <p>
                      <strong>Recipient Number:</strong>{" "}
                      {selectedOrder.recipientNumber}
                    </p>
                    <p>
                      <strong>Price:</strong> {selectedOrder.price}
                    </p>
                    <p>
                      <strong>Driver:</strong> {selectedOrder.driver}
                    </p>
                  </div>
                  <div>
                    <p>
                      <strong>Estimated Delivery Time:</strong>{" "}
                      {selectedOrder.estimatedDeliveryTime}
                    </p>
                  </div>
                </div>
              ) : (
                <p>Chưa chọn đơn hàng</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewOrder;
