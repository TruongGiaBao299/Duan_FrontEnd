import React, { useState, useEffect } from "react";
import { getOrderByEmailApi } from "../../utils/orderAPI/orderAPI";
import { toast } from "react-toastify";

const ViewOrder = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getOrderByEmailApi();
        console.log("Order by email:", res);
        console.log("Order by email length:", res.length);
  
        // Filter orders to show only those with status "pending" or "is shipping"
        if (res && res.length > 0) {
          const filteredOrders = res.filter(
            (order) => order.status === "pending" || order.status === "is shipping"
          );
          setOrders(filteredOrders); // Update state with filtered orders
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
                <strong>From Address:</strong> {order.fromAddress}, {order.fromDistrict}, {order.fromCity}
              </p>
              <p>
                <strong>Recipient Name:</strong> {order.recipientName}
              </p>
              <p>
                <strong>Recipient Number:</strong> {order.recipientNumber}
              </p>
              <p>
                <strong>To Address:</strong> {order.toAddress}, {order.toDistrict}, {order.toCity}
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewOrder;
