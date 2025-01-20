import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styles from "./PostOfficeHistory.module.css";
import { SentPostOfficeApi } from "../../utils/driverAPI/driverAPI";
import {
  getPostOfficeByEmailApi,
  getPostOfficeOrderByEmailApi,
} from "../../utils/postOfficeAPI/postOfficeAPI";

const PostOfficeHistory = () => {
  const [orders, setOrders] = useState([]);
  const [postCity, setPostCity] = useState("");
  const [postEmail, setPostEmail] = useState("");

  // Fetch orders associated with the current post office
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getPostOfficeOrderByEmailApi();
        if (res && res.length > 0) {
          setOrders(res);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Error fetching orders.");
      }
    };
    fetchOrders();
  }, []);

  // Fetch the current post office information
  useEffect(() => {
    const fetchPostOffice = async () => {
      try {
        const res = await getPostOfficeByEmailApi();
        if (res) {
          setPostCity(res.city);
          setPostEmail(res.email);
        } else {
          setPostCity("");
          setPostEmail("");
        }
      } catch (error) {
        console.error("Error fetching post office:", error);
        toast.error("Error fetching post office data.");
      }
    };
    fetchPostOffice();
  }, []);

  return (
    <div className={styles.driverordercontainer}>
      {orders.filter(
        (order) =>
          order.status === "shipped" && order.postOffice === postEmail
      ).length === 0 ? (
        <p>You don't have any orders!</p>
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
                <th>Driver</th>
                <th>PostOffice</th>
              </tr>
            </thead>
            <tbody>
              {orders
                .filter(
                  (order) =>
                    order.status === "shipped" && order.postOffice === postEmail
                )
                .map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.senderName}</td>
                    <td>{order.senderNumber}</td>
                    <td>
                      {`${order.fromAddress}, ${order.fromDistrict}, ${order.fromCity}`}
                    </td>
                    <td>{order.recipientName}</td>
                    <td>{order.recipientNumber}</td>
                    <td>
                      {order.toAddress}, {order.toDistrict}, {order.toCity}
                    </td>
                    <td>{order.orderWeight}</td>
                    <td>{order.orderSize}</td>
                    <td>{order.type}</td>
                    <td>{order.message}</td>
                    <td>{order.price}</td>
                    <td>{order.status}</td>
                    <td>{order.createdBy}</td>
                    <td>{order.driver}</td>
                    <td>{order.postOffice}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PostOfficeHistory;
