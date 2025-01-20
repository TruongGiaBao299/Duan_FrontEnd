import React, { useState, useEffect } from "react";
import { getOrderByEmailApi } from "../../utils/orderAPI/orderAPI";
import { toast } from "react-toastify";

const ViewHistory = () => {
  const [orders, setOrders] = useState([]); // All orders fetched from API
  const [filteredOrders, setFilteredOrders] = useState([]); // Orders to display based on filter
  const [filter, setFilter] = useState("all"); // Filter state: "all", "shipped", "canceled"

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getOrderByEmailApi();
        console.log("Order by email:", res);

        if (res && res.length > 0) {
          setOrders(res); // Store all orders
          setFilteredOrders(
            res.filter(
              (order) =>
                order.status === "shipped" || order.status === "canceled"
            )
          ); // Initially show only shipped and canceled orders
        } else {
          setOrders([]);
          setFilteredOrders([]);
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Error fetching orders");
      }
    };

    fetchUser();
  }, []);

  const handleFilterChange = (status) => {
    setFilter(status);

    if (status === "all") {
      setFilteredOrders(
        orders.filter(
          (order) => order.status === "shipped" || order.status === "canceled"
        )
      );
    } else {
      setFilteredOrders(orders.filter((order) => order.status === status));
    }
  };

  return (
    <div>
      <h2>Order History</h2>

      {/* Filter Buttons */}
      <div>
        <button
          onClick={() => handleFilterChange("all")}
          style={{ marginRight: "10px" }}
        >
          All
        </button>
        <button
          onClick={() => handleFilterChange("shipped")}
          style={{ marginRight: "10px" }}
        >
          Shipped
        </button>
        <button onClick={() => handleFilterChange("canceled")}>Canceled</button>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <p>No orders match the selected filter!</p>
      ) : (
        <div>
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              style={{
                border: "1px solid #ccc",
                margin: "10px 0",
                padding: "10px",
              }}
            >
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewHistory;
