import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  CancelledOrderApi,
  getDriverOrderByEmailApi,
  ShippedOrderApi,
  SentPostOfficeApi,
  getDriverByEmailApi,
} from "../../utils/driverAPI/driverAPI";
import { getPostOfficeApi } from "../../utils/postOfficeAPI/postOfficeAPI";
import styles from "./DriverMangeOrder.module.css";

const DriverMangeOrder = () => {
  const [orders, setOrders] = useState([]);
  const [emails, setEmails] = useState({});
  const [data, setData] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [showPopup, setShowPopup] = useState(false); // Add state for showing the popup
  const [expandedOrder, setExpandedOrder] = useState(null); // Store the selected order for details

  const HERE_API_KEY = "MnTadIKOVDRqhQYalpBxtEG3AiWROupfqiPOBzfiWsw";

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getDriverOrderByEmailApi();
        if (res && res.length > 0) {
          setOrders(res);
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

  useEffect(() => {
    const fetchPostOffices = async () => {
      try {
        const res = await getPostOfficeApi();
        if (res) {
          setData(res);
        } else {
          setData([]);
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Failed to fetch post office data. Please try again!");
      }
    };
    fetchPostOffices();
  }, []);

  const handleSubmit = async (e, orderId) => {
    e.preventDefault();
    const email = emails[orderId];

    if (!email) {
      toast.error("Please choose a valid email.");
      return;
    }

    try {
      await SentPostOfficeApi(orderId, email);
      toast.success("Post office email updated successfully!");

      const updatedOrders = orders.map((order) =>
        order._id === orderId ? { ...order, postOffice: email } : order
      );
      setOrders(updatedOrders);

      setEmails((prev) => ({
        ...prev,
        [orderId]: "",
      }));
    } catch (error) {
      console.error("Error update:", error);
      toast.error("Failed to update. Please try again.");
    }
  };

  const filteredOrders =
    filterStatus === "all"
      ? orders
      : orders.filter((order) => order.status === filterStatus);

  const totalOrders = orders.length;
  const totalShippedOrders = orders.filter(
    (order) => order.status === "shipped"
  ).length;
  const totalIsShippingOrders = orders.filter(
    (order) => order.status === "is shipping"
  ).length;
  const totalDeliveryToPostOfficeOrders = orders.filter(
    (order) => order.status === "delivery to post office"
  ).length;

  const totalIncome = orders
    .filter((order) => order.status === "shipped")
    .reduce((sum, order) => sum + order.price * 0.1, 0);

  const handleShowDetails = (order) => {
    setExpandedOrder(order);
    setShowPopup(true);
  };

  // 📍 Hàm lấy tọa độ từ địa chỉ dùng API Geocoding của HERE
  const getCoordinates = async (address) => {
    try {
      const response = await fetch(
        `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(
          address
        )}&apiKey=${HERE_API_KEY}`
      );
      const data = await response.json();
      if (data.items.length > 0) {
        return {
          lat: data.items[0].position.lat,
          lng: data.items[0].position.lng,
        };
      }
      return null;
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      return null;
    }
  };

  // Mở bản đồ HERE với hướng dẫn đường đi
  const handleOpenMap = async (order) => {
    let addressToUse = "";
    let mapUrl = "";

    if (order.status === "delivery to post office") {
      addressToUse = order.fromAddress;
    } else if (order.status === "is shipping") {
      addressToUse = order.toAddress;
    }

    if (addressToUse) {
      try {
        const userPosition = await new Promise((resolve, reject) => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          } else {
            reject(new Error("Geolocation is not supported by this browser."));
          }
        });

        const userCoords = {
          lat: userPosition.coords.latitude,
          lng: userPosition.coords.longitude,
        };

        const coords = await getCoordinates(addressToUse);

        if (coords) {
          // Tạo URL bản đồ HERE với các tọa độ
          mapUrl = `https://www.here.com/directions/drive/${userCoords.lat},${userCoords.lng}/${coords.lat},${coords.lng}`;

          // Tính toán vị trí trung tâm của cửa sổ
          const windowWidth = 1000; // Chiều rộng cửa sổ popup
          const windowHeight = 800; // Chiều cao cửa sổ popup

          const left = (window.innerWidth - windowWidth) / 2;
          const top = (window.innerHeight - windowHeight) / 2;

          // Mở cửa sổ popup ở vị trí trung tâm của màn hình
          window.open(
            mapUrl,
            "_blank",
            `width=${windowWidth},height=${windowHeight},top=${top},left=${left},scrollbars=no,toolbar=no,location=no`
          );
        } else {
          toast.error("Unable to fetch location coordinates.");
        }
      } catch (error) {
        console.error("Error getting user location:", error);
        toast.error("Unable to fetch your current location.");
      }
    }
  };

  return (
    <div className={styles.Container}>
      {/* Hiển thị số lượng đơn và thu nhập */}
      <div className={styles.OrderInfo}>
        <h3>Total Orders: {totalOrders}</h3>
        <h3>Shipped Orders: {totalShippedOrders}</h3>
        <h3>Is Shipping Orders: {totalIsShippingOrders}</h3>
        <h3>
          Delivery to Post Office Orders: {totalDeliveryToPostOfficeOrders}
        </h3>
        <h3>
          Total Income:{" "}
          {totalIncome.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
        </h3>
      </div>

      {/* Nút bộ lọc */}
      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => setFilterStatus("all")}>All</button>
        <button onClick={() => setFilterStatus("delivery to post office")}>
          Delivery to Post Office
        </button>
        <button onClick={() => setFilterStatus("shipped")}>Shipped</button>
        <button onClick={() => setFilterStatus("is shipping")}>
          Is Shipping
        </button>
      </div>

      {filteredOrders.length === 0 ? (
        <p>No orders match the selected filter!</p>
      ) : (
        <div>
          {filteredOrders.map((order) => (
            <div className={styles.OrderContainer} key={order._id}>
              <p>
                <strong>Order ID:</strong> {order._id}
              </p>
              <p>
                <strong>From Address:</strong> {order.fromAddress},{" "}
                {order.fromDistrict}, {order.fromWard}, {order.fromCity}
              </p>
              <p>
                <strong>To Address:</strong> {order.toAddress},{" "}
                {order.toDistrict}, {order.toWard}, {order.toCity}
              </p>
              <p>
                <strong>Price:</strong> {order.price}
              </p>
              <p>
                <strong>Status:</strong> {order.status}
              </p>

              <div className={styles.SentContent}>
                <button onClick={() => handleShowDetails(order)}>
                  Show Details
                </button>

                {/* Nút mở bản đồ HERE */}
                {order.status !== "shipped" && order.status !== "canceled" && (
                  <button onClick={() => handleOpenMap(order)}>Open Map</button>
                )}

                {!order.postOffice &&
                  order.status !== "shipped" &&
                  order.status !== "canceled" && (
                    <div>
                      <form onSubmit={(e) => handleSubmit(e, order._id)}>
                        <select
                          value={emails[order._id] || ""}
                          onChange={(e) =>
                            setEmails((prev) => ({
                              ...prev,
                              [order._id]: e.target.value,
                            }))
                          }
                          required
                        >
                          <option value="">Select a Post Office</option>
                          {data
                            .filter(
                              (postOffice) =>
                                postOffice.OfficeDistrict ===
                                  order.fromDistrict ||
                                (postOffice.OfficeDistrict !==
                                  order.fromDistrict &&
                                  postOffice.OfficeCity === order.fromCity)
                            )
                            .map((postOffice) => (
                              <option
                                key={postOffice.email}
                                value={postOffice.email}
                              >
                                {postOffice.OfficeName}
                              </option>
                            ))}
                        </select>
                        <button type="submit">Sent to</button>
                      </form>
                    </div>
                  )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Show Details Popup */}
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
              <strong>From Address:</strong> {expandedOrder.fromAddress}
            </p>
            <p>
              <strong>From District:</strong> {expandedOrder.fromDistrict}
            </p>
            <p>
              <strong>From City:</strong> {expandedOrder.fromCity}
            </p>
            <p>
              <strong>Recipient Name:</strong> {expandedOrder.recipientName}
            </p>
            <p>
              <strong>Recipient Number:</strong> {expandedOrder.recipientNumber}
            </p>
            <p>
              <strong>To Address:</strong> {expandedOrder.toAddress}
            </p>
            <p>
              <strong>To District:</strong> {expandedOrder.toDistrict}
            </p>
            <p>
              <strong>To City:</strong> {expandedOrder.toCity}
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
            {expandedOrder.postOffice && (
              <p>
                <strong>PostOffice:</strong> {expandedOrder.postOffice}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverMangeOrder;
