import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styles from "./PostOfficeHistory.module.css";
import {
  getPostOfficeByEmailApi,
  getPostOfficeOrderByEmailApi,
} from "../../utils/postOfficeAPI/postOfficeAPI";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { MdOutlineDoubleArrow } from "react-icons/md";

const PostOfficeHistory = () => {
  const [orders, setOrders] = useState([]);
  const [postCity, setPostCity] = useState("");
  const [postEmail, setPostEmail] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const res = await getPostOfficeOrderByEmailApi();
        setOrders(res && res.length > 0 ? res : []);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Error fetching orders.");
      } finally {
        setIsLoading(false); // Mark loading as complete
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    const fetchPostOffice = async () => {
      try {
        const res = await getPostOfficeByEmailApi();
        if (res) {
          setPostCity(res.city);
          setPostEmail(res.email);
        }
      } catch (error) {
        console.error("Error fetching post office:", error);
        toast.error("Error fetching post office data.");
      }
    };
    fetchPostOffice();
  }, []);

  const totalOrders = orders.length;
  const totalShippedOrders = orders.filter(
    (order) => order.status === "shipped" && order.postOffice === postEmail
  ).length;

  const totalCommission = orders
    .filter(
      (order) => order.status === "shipped" && order.postOffice === postEmail
    )
    .reduce((sum, order) => sum + order.price * 0.2, 0);

  const handleShowDetails = (order) => {
    setExpandedOrder(order);
    setShowPopup(true);
  };

  if (isLoading) {
    // Hiển thị trạng thái Loading
    return <LoadingSpinner isLoading={isLoading}></LoadingSpinner>;
  }

  return (
    <div className={styles.driverordercontainer}>
      <div className={styles.stats}>
        <h3>Total Orders: {totalShippedOrders}</h3>
      </div>

      {totalShippedOrders === 0 ? (
        <p>You don't have any shipped orders!</p>
      ) : (
        <div>
          {orders
            .filter(
              (order) =>
                order.status === "shipped" && order.postOffice === postEmail
            )
            .map((order) => (
              <div className={styles.OrderContent} key={order._id}>
                <div className={styles.addressInfo}>
                  <p>
                    <strong>Order ID:</strong> {order._id}
                  </p>
                  <div className={styles.addressGroup}>
                    <p>
                      <strong>From Address: </strong>
                      {`${order.fromAddress}, ${order.fromDistrict},  ${order.fromWard}, ${order.fromCity}`}
                    </p>

                    <MdOutlineDoubleArrow />

                    <p>
                      <strong>To Address:</strong>{" "}
                      {`${order.toAddress}, ${order.toDistrict},  ${order.toWard}, ${order.toCity}`}
                    </p>
                  </div>
                </div>

                <div className={styles.noteInfo}>
                  <p>
                    <strong>Order Weight:</strong> {order.orderWeight}
                  </p>
                  <p>
                    <strong>Order Size:</strong> {order.orderSize}
                  </p>
                  <p>
                    <strong>Type:</strong> {order.type}
                  </p>
                </div>
                <div className={styles.SentContent}>
                  {/* Show Details Button */}
                  <button onClick={() => handleShowDetails(order)}>
                    Show Details
                  </button>
                </div>
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
            <h3>Order Details</h3>
            <p>
              <strong>Order ID:</strong> {expandedOrder._id}
            </p>
            <p>
              <strong>Sender Name:</strong> {expandedOrder.senderName}
            </p>
            <p>
              <strong>Sender Number:</strong> {expandedOrder.senderNumber}
            </p>
            <p>
              <strong>From Address:</strong> {expandedOrder.fromAddress},{" "}
              {expandedOrder.fromDistrict}, {expandedOrder.fromCity}
            </p>
            <p>
              <strong>Recipient Name:</strong> {expandedOrder.recipientName}
            </p>
            <p>
              <strong>Recipient Number:</strong> {expandedOrder.recipientNumber}
            </p>
            <p>
              <strong>To Address:</strong> {expandedOrder.toAddress},{" "}
              {expandedOrder.toDistrict}, {expandedOrder.toCity}
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
              <strong>Status:</strong> {expandedOrder.status}
            </p>
            <p>
              <strong>Created By:</strong> {expandedOrder.createdBy}
            </p>
            <p>
              <strong>Driver:</strong> {expandedOrder.driver}
            </p>
            <p>
              <strong>Post Office:</strong> {expandedOrder.postOffice}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostOfficeHistory;
