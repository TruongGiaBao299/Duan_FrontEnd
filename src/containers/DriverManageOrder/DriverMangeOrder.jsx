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

const DriverMangeOrder = () => {
  const [orders, setOrders] = useState([]);
  const [emails, setEmails] = useState({});
  const [data, setData] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");

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

  return (
    <div>
      {/* Hiển thị số lượng đơn và thu nhập */}
      <div style={{ marginBottom: "20px" }}>
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
          <h2>Order Information</h2>
          {filteredOrders.map((order) => (
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
              {order.postOffice && (
                <p>
                  <strong>PostOffice:</strong> {order.postOffice}
                </p>
              )}

              {!order.postOffice &&
                order.status !== "shipped" &&
                order.status !== "canceled" && (
                  <div>
                    <h3>Update Post Office Email</h3>
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
                      <button type="submit">Submit</button>
                    </form>
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
