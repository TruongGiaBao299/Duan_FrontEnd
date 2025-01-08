import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styles from "./DriverGetOrder.module.css";
import { AcceptOrderApi, IsShippingOrderApi } from "../../utils/driverAPI/driverAPI";
import { getOrderApi } from "../../utils/orderAPI/orderAPI";

const DriverGetOrder = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getOrderApi();
        console.log("Order:", res);

        // Check if the response has orders data
        if (res && res.length > 0) {
          setOrders(res);
        } else {
          setOrders([]); // If no orders, set as empty
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Error fetching orders");
      }
    };

    fetchOrders();
  }, []);

  const AcceptOrder = async (orderId) => {
    try {
      const res = await AcceptOrderApi(orderId);
      console.log("Accept Order Response:", res);
      toast.success("Order status updated to driver successfully!");

      // Update the order's status in the UI
      const updatedOrders = orders.map((order) =>
        order._id === orderId ? { ...order, status: "delivery to post office" } : order
      );
      setOrders(updatedOrders);
    } catch (error) {
      console.error("Error update:", error);
      toast.error("Failed to update. Please try again.");
    }
  };

  const AcceptOrderIsShipping = async (orderId) => {
    try {
      const res = await IsShippingOrderApi(orderId);
      console.log("Accept Order Response:", res);
      toast.success("Order status updated to driver successfully!");

      // Update the order's status in the UI
      const updatedOrders = orders.map((order) =>
        order._id === orderId ? { ...order, status: "is shipping" } : order
      );
      setOrders(updatedOrders);
    } catch (error) {
      console.error("Error update:", error);
      toast.error("Failed to update. Please try again.");
    }
  };

  return (
    <div className={styles.driverordercontainer}>
      {orders.filter((order) => order.status === "pending" || order.status === "delivery to post office").length === 0 ? (
        <p>You don't have any pending orders!</p>
      ) : (
        <div>
          <table className={styles.driverordertable}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Sender Name</th>
                <th>Sender Number</th>
                <th>From Address</th>
                <th>Recipient Name</th>
                <th>Recipient Number</th>
                <th>To Address</th>
                <th>Order Weight</th>
                <th>Order Size</th>
                <th>Type</th>
                <th>Message</th>
                <th>Price</th>
                <th>Status</th>
                <th>Created By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders
                .filter((order) => order.status === "pending" || order.status === "delivery to post office")
                .map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.senderName}</td>
                    <td>{order.senderNumber}</td>
                    <td>
                      {`${order.fromAddress}, District: ${order.fromDistrict}, City: ${order.fromCity}`}
                    </td>
                    <td>{order.recipientName}</td>
                    <td>{order.recipientNumber}</td>
                    <td>
                      {`${order.toAddress}, District: ${order.toDistrict}, City: ${order.toCity}`}
                    </td>
                    <td>{order.orderWeight}</td>
                    <td>{order.orderSize}</td>
                    <td>{order.type}</td>
                    <td>{order.message}</td>
                    <td>{order.price}</td>
                    <td>{order.status}</td>
                    <td>{order.createdBy}</td>
                    <td>
                      <button
                        className={styles.becomeDriverButton}
                        onClick={() =>
                          order.status === "pending"
                            ? AcceptOrder(order._id)
                            : AcceptOrderIsShipping(order._id)
                        }
                      >
                        Accept Request
                      </button>
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

export default DriverGetOrder;
