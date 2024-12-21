import React, { useEffect, useState } from "react";
import styles from "./Orders.module.css"; // Ensure this file includes proper table styling
import { getOrderApi } from "../../utils/api";
import { toast } from "react-toastify";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
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

    fetchUser();
  }, []);

  return (
    <div className={styles.container}>
      {orders.length === 0 ? (
        <p>You don't have any orders!</p> // Display message if no orders
      ) : (
        <div>
          <table className={styles.table}>
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
                <th>Driver</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
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
                    {order.toAddress}, District: {order.toDistrict}, City:{" "}
                    {order.toCity}
                  </td>
                  <td>{order.orderWeight}</td>
                  <td>{order.orderSize}</td>
                  <td>{order.type}</td>
                  <td>{order.message}</td>
                  <td>{order.price}</td>
                  <td>{order.status}</td>
                  <td>{order.createdBy}</td>
                  <td>{order.driver}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;
